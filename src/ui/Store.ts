import { useState } from 'react'
import { createContainer } from 'unstated-next'

function Store() {
  const [integrationToken, setIntegrationToken] = useState('')
  const [databaseId, setDatabaseId] = useState('')
  const [valueName, setValueName] = useState('')

  return {
    integrationToken,
    databaseId,
    valueName,
    setIntegrationToken,
    setDatabaseId,
    setValueName
  }
}

export default createContainer(Store)
