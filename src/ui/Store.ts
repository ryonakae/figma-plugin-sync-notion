import { useState } from 'react'
import { createContainer } from 'unstated-next'

function Store() {
  const [integrationToken, setIntegrationToken] = useState('')
  const [databaseId, setDatabaseId] = useState('')
  const [keyPropertyName, setKeyPropertyName] = useState('')
  const [valuePropertyName, setValuePropertyName] = useState('')

  return {
    integrationToken,
    databaseId,
    keyPropertyName,
    valuePropertyName,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName
  }
}

export default createContainer(Store)
