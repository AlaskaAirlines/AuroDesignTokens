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
  variableOverrides?: { [variableId: string]: any },
  collections?: { [id: string]: any },
  extensionModeId?: string
): any {
  // Check if there's an override for this variable in the extension collection mode
  if (variableOverrides && variableOverrides[variable.id] && extensionModeId && variableOverrides[variable.id][extensionModeId]) {
    const overrideValue = variableOverrides[variable.id][extensionModeId]
    if (typeof overrideValue === 'object') {
      if ('type' in overrideValue && overrideValue.type === 'VARIABLE_ALIAS') {
        const aliasedVariable = localVariables[overrideValue.id]
        if (aliasedVariable) {
          const resolvedModeId = findCorrectModeForVariable(aliasedVariable, modeId, collections)
          if (resolvedModeId) {
            return tokenValueFromVariable(aliasedVariable, resolvedModeId, localVariables, variableOverrides, collections, extensionModeId)
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

  // Check if there's an override for this variable in the parent mode (fallback)
  if (variableOverrides && variableOverrides[variable.id] && variableOverrides[variable.id][modeId]) {
    const overrideValue = variableOverrides[variable.id][modeId]
    if (typeof overrideValue === 'object') {
      if ('type' in overrideValue && overrideValue.type === 'VARIABLE_ALIAS') {
        const aliasedVariable = localVariables[overrideValue.id]
        if (aliasedVariable) {
          const resolvedModeId = findCorrectModeForVariable(aliasedVariable, modeId, collections)
          if (resolvedModeId) {
            return tokenValueFromVariable(aliasedVariable, resolvedModeId, localVariables, variableOverrides, collections, extensionModeId)
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
    // If the exact mode doesn't exist, try to find the correct mode for this variable
    const correctModeId = findCorrectModeForVariable(variable, modeId, collections)
    if (correctModeId && correctModeId !== modeId) {
      return tokenValueFromVariable(variable, correctModeId, localVariables, variableOverrides, collections, extensionModeId)
    }
    return undefined
  }

  if (typeof value === 'object') {
    if ('type' in value && value.type === 'VARIABLE_ALIAS') {
      const aliasedVariable = localVariables[value.id]
      if (aliasedVariable) {
        const resolvedModeId = findCorrectModeForVariable(aliasedVariable, modeId, collections)
        if (resolvedModeId) {
          return tokenValueFromVariable(aliasedVariable, resolvedModeId, localVariables, variableOverrides, collections, extensionModeId)
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

function findCorrectModeForVariable(
  variable: LocalVariable,
  currentModeId: string,
  collections?: { [id: string]: any }
): string | undefined {
  // First, check if the variable has the current mode
  if (variable.valuesByMode[currentModeId]) {
    return currentModeId
  }

  // If collections info is available, try to find corresponding mode
  if (collections && variable.variableCollectionId) {
    const variableCollection = collections[variable.variableCollectionId]
    if (variableCollection) {
      // For extension collections, we need to map the current mode to the correct parent mode
      if (variableCollection.isExtension && variableCollection.parentVariableCollectionId) {
        const parentCollection = collections[variableCollection.parentVariableCollectionId]
        if (parentCollection) {
          // Try to find a mode mapping or use the first available mode in parent collection
          const parentModes = parentCollection.modes || []
          if (parentModes.length > 0) {
            // Look for a mode that matches by name or use the first one
            const matchingMode = parentModes.find((mode: any) => 
              variable.valuesByMode[mode.modeId] !== undefined
            )
            if (matchingMode) {
              return matchingMode.modeId
            }
          }
        }
      }
      
      // For regular collections, try to find any available mode
      const availableModes = Object.keys(variable.valuesByMode)
      if (availableModes.length > 0) {
        // Prefer modes from the same collection if available
        const collectionModes = (variableCollection.modes || []).map((mode: any) => mode.modeId)
        const matchingCollectionMode = availableModes.find(modeId => 
          collectionModes.includes(modeId)
        )
        if (matchingCollectionMode) {
          return matchingCollectionMode
        }
        
        // Fall back to the first available mode
        return availableModes[0]
      }
    }
  }

  // Final fallback: use the first available mode
  const availableModes = Object.keys(variable.valuesByMode)
  return availableModes.length > 0 ? availableModes[0] : undefined
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
              // Skip when these variables are present
              if (variable.remote || variable.deletedButReferenced) {
                return
              }
              
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
                  collection.variableOverrides,
                  localVariableCollections,
                  mode.modeId // Pass the extension mode ID
                ),
                $description: variable.description,
                $extensions: {
                  'com.figma': {
                    hiddenFromPublishing: variable.hiddenFromPublishing,
                    scopes: variable.scopes,
                    codeSyntax: variable.codeSyntax,
                    isOverride: !!(collection.variableOverrides && collection.variableOverrides[variable.id]),
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
}
