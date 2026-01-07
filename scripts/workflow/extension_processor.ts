import { GetLocalVariablesResponse, LocalVariable } from '@figma/rest-api-spec'
import { rgbToHex } from './color.js'
import { Token, TokensFile } from './token_types.js'
import * as fs from 'fs'
import path from "path";

function tokenTypeFromVariable(variable: LocalVariable) {
  switch (variable.resolvedType) {
    case 'BOOLEAN':
      return 'boolean'
    case 'COLOR':
      return 'color'
    case 'FLOAT':
      return 'number'
    case 'STRING':
      return 'string'
  }
}

function tokenValueFromVariable(
  variable: LocalVariable,
  modeId: string,
  localVariables: { [id: string]: LocalVariable },
  variableOverrides?: { [variableId: string]: any }
): any {
  // Check if there's an override for this variable in this mode
  if (variableOverrides && variableOverrides[variable.id] && variableOverrides[variable.id][modeId]) {
    const overrideValue = variableOverrides[variable.id][modeId]
    if (typeof overrideValue === 'object') {
      if ('type' in overrideValue && overrideValue.type === 'VARIABLE_ALIAS') {
        const aliasedVariable = localVariables[overrideValue.id]
        if (aliasedVariable) {
          // Try to find a matching mode ID, or fall back to the first available mode
          const aliasedModeId = aliasedVariable.valuesByMode[modeId] ? 
            modeId : Object.keys(aliasedVariable.valuesByMode)[0]
          if (aliasedModeId) {
            return tokenValueFromVariable(aliasedVariable, aliasedModeId, localVariables, variableOverrides)
          }
        }
        return `{UNKNOWN_VARIABLE_${overrideValue.id}}`
      } else if ('r' in overrideValue) {
        return rgbToHex(overrideValue)
      }
    } else {
      return overrideValue
    }
  }

  // Fall back to the original variable value
  const value = variable.valuesByMode[modeId]
  if (value === undefined) {
    // If the exact mode doesn't exist, try the first available mode
    const availableModeId = Object.keys(variable.valuesByMode)[0]
    if (availableModeId) {
      return tokenValueFromVariable(variable, availableModeId, localVariables, variableOverrides)
    }
    return undefined
  }

  if (typeof value === 'object') {
    if ('type' in value && value.type === 'VARIABLE_ALIAS') {
      const aliasedVariable = localVariables[value.id]
      if (aliasedVariable) {
        // Try to find a matching mode ID, or fall back to the first available mode
        const aliasedModeId = aliasedVariable.valuesByMode[modeId] ? 
          modeId : Object.keys(aliasedVariable.valuesByMode)[0]
        if (aliasedModeId) {
          return tokenValueFromVariable(aliasedVariable, aliasedModeId, localVariables, variableOverrides)
        }
      }
      return `{UNKNOWN_VARIABLE_${value.id}}`
    } else if ('r' in value) {
      return rgbToHex(value)
    }

    throw new Error(`Format of variable value is invalid: ${JSON.stringify(value)}`)
  } else {
    return value
  }
}

export function createExtensionFiles(
  localVariablesResponse: GetLocalVariablesResponse, 
  outputDir: string = 'tokenDefinitions/figmaExports'
) {
  const localVariableCollections = localVariablesResponse.meta.variableCollections
  const localVariables = localVariablesResponse.meta.variables

  // Find all extension collections (exclude remote collections)
  const extensionCollections = Object.values(localVariableCollections).filter(
    collection => collection.isExtension === true && !collection.remote
  )

  extensionCollections.forEach((collection) => {
    // Create token files for each mode in the extension collection
    collection.modes.forEach((mode) => {
      const tokensFile: TokensFile = {}

      // Get parent collection variables if available
      const parentCollection = collection.parentVariableCollectionId ? 
        localVariableCollections[collection.parentVariableCollectionId] : null

      if (parentCollection) {
        // Find parent mode - use the parentModeId if available, otherwise use the first mode
        const parentModeId = mode.parentModeId || parentCollection.modes[0]?.modeId

        if (parentModeId) {
          // Process all variables from parent collection
          Object.values(localVariables).forEach((variable) => {
            if (variable.variableCollectionId === parentCollection.id) {
              // Build nested object structure from variable name path
              let obj: any = tokensFile
              variable.name.split('/').forEach((groupName) => {
                obj[groupName] = obj[groupName] || {}
                obj = obj[groupName]
              })

              // Create token with potential override
              const token: Token = {
                $type: tokenTypeFromVariable(variable),
                $value: tokenValueFromVariable(
                  variable, 
                  parentModeId, 
                  localVariables, 
                  collection.variableOverrides
                ),
                $description: variable.description,
                $extensions: {
                  'com.figma': {
                    hiddenFromPublishing: variable.hiddenFromPublishing,
                    scopes: variable.scopes,
                    codeSyntax: variable.codeSyntax,
                    isOverride: collection.variableOverrides && collection.variableOverrides[variable.id] ? true : false,
                    parentCollectionId: parentCollection.id,
                    extensionCollectionId: collection.id
                  },
                },
              }

              Object.assign(obj, token)
            }
          })
        }
      }

      // Create filename without IDs
      const safeName = collection.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
      const safeModeName = mode.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
      const fileName = `${safeName}.${safeModeName}.json`
      
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      // Write the file
      const filePath = path.join(process.cwd(), outputDir, fileName)
      fs.writeFileSync(filePath, JSON.stringify(tokensFile, null, 2))

    })
  })

  return extensionCollections.length
}
