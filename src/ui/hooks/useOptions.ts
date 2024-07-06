import type { ClientStorageOptions, DocumentOptions } from '@/types/common'
import { useClientStorageStore, useDocumentStore } from '@/ui/Store'

export default function useOptions() {
  function updateDocumentOptions(
    keyValue: { [T in keyof DocumentOptions]?: DocumentOptions[T] },
  ) {
    console.log('updateDocumentOptions', {
      ...useDocumentStore.getState(),
      ...keyValue,
    })
    useDocumentStore.setState({ ...useDocumentStore.getState(), ...keyValue })
  }

  function updateClientStorageOptions(
    keyValue: { [T in keyof ClientStorageOptions]?: ClientStorageOptions[T] },
  ) {
    console.log('updateClientStorageOptions', {
      ...useClientStorageStore.getState(),
      ...keyValue,
    })
    useClientStorageStore.setState({
      ...useClientStorageStore.getState(),
      ...keyValue,
    })
  }

  return { updateDocumentOptions, updateClientStorageOptions }
}
