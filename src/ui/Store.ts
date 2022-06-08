import { useState } from 'react'
import { createContainer } from 'unstated-next'

function Store() {
  const [integrationToken, setIntegrationToken] = useState('')
  const [databaseId, setDatabaseId] = useState('')

  return {
    integrationToken,
    databaseId,
    setIntegrationToken,
    setDatabaseId
  }
}

export default createContainer(Store)
