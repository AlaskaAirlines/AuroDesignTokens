import { GetLocalVariablesResponse, LocalVariable } from '@figma/rest-api-spec'
import { rgbToHex } from './color.js'
import { Token, TokensFile } from './token_types.js'

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
): any {
  const value = variable.valuesByMode[modeId]
  if (value === undefined) {
    // If the exact mode doesn't exist, try the first available mode
    const availableModeId = Object.keys(variable.valuesByMode)[0]
    if (availableModeId) {
      return tokenValueFromVariable(variable, availableModeId, localVariables)
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
          return tokenValueFromVariable(aliasedVariable, aliasedModeId, localVariables)
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

export function tokenFilesFromLocalVariables(localVariablesResponse: GetLocalVariablesResponse) {
  const tokenFiles: { [fileName: string]: TokensFile } = {}
  const localVariableCollections = localVariablesResponse.meta.variableCollections
  const localVariables = localVariablesResponse.meta.variables

  Object.values(localVariables).forEach((variable) => {
    // Skip remote variables because we only want to generate tokens for local variables
    if (variable.remote) {
      return
    }    
    const collection = localVariableCollections[variable.variableCollectionId]

    collection.modes.forEach((mode) => {
      const safeName = collection.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
      const safeModeName = mode.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
      const fileName = `${safeName}.${safeModeName}.json`

      if (!tokenFiles[fileName]) {
        tokenFiles[fileName] = {}
      }

      let obj: any = tokenFiles[fileName]

      variable.name.split('/').forEach((groupName) => {
        obj[groupName] = obj[groupName] || {}
        obj = obj[groupName]
      })

      const token: Token = {
        $type: tokenTypeFromVariable(variable),
        $value: tokenValueFromVariable(variable, mode.modeId, localVariables),
        $description: variable.description,
        $extensions: {
          'com.figma': {
            hiddenFromPublishing: variable.hiddenFromPublishing,
            scopes: variable.scopes,
            codeSyntax: variable.codeSyntax,
          },
        },
      }

      Object.assign(obj, token)
    })
  })

  return tokenFiles
}
