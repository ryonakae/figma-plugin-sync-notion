import { useState } from 'react'
import { createContainer } from 'unstated-next'

function Store() {
  const [apiUrl, setApiUrl] = useState('')
  const [integrationToken, setIntegrationToken] = useState('')
  const [databaseId, setDatabaseId] = useState('')
  const [keyPropertyName, setKeyPropertyName] = useState('')
  const [valuePropertyName, setValuePropertyName] = useState('')

  return {
    apiUrl,
    integrationToken,
    databaseId,
    keyPropertyName,
    valuePropertyName,
    setApiUrl,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName
  }
}

export default createContainer(Store)
