import { useState } from 'react'
import { createContainer } from 'unstated-next'

function Store() {
  const [apiUrl, setApiUrl] = useState('')
  const [integrationToken, setIntegrationToken] = useState('')
  const [databaseId, setDatabaseId] = useState('')
  const [keyPropertyName, setKeyPropertyName] = useState('')
  const [valuePropertyName, setValuePropertyName] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [highlighting, setHighlighting] = useState(false)

  return {
    apiUrl,
    integrationToken,
    databaseId,
    keyPropertyName,
    valuePropertyName,
    syncing,
    highlighting,
    setApiUrl,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName,
    setSyncing,
    setHighlighting
  }
}

export default createContainer(Store)
