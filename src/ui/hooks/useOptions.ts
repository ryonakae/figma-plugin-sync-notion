import { emit } from '@create-figma-plugin/utilities'

import { useStore } from '@/ui/Store'

import type { Options } from '@/types/common'
import type { SaveOptionsHandler } from '@/types/eventHandler'

export default function useOptions() {
  function updateOptions(keyValue: { [T in keyof Options]?: Options[T] }) {
    console.log('updateOptions', {
      ...useStore.getState(),
      ...keyValue,
    })
    useStore.setState({ ...useStore.getState(), ...keyValue })
  }

  function saveOptionsToClientStorage(options: Options) {
    console.log('saveOptionsToClientStorage', options)
    emit<SaveOptionsHandler>('SAVE_OPTIONS', options)
  }

  return { updateOptions, saveOptionsToClientStorage }
}
