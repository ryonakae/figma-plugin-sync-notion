import { emit, once } from '@create-figma-plugin/utilities'

import { useStore } from '@/ui/Store'

import type { Options } from '@/types/common'
import type {
  LoadOptionsFromMainHandler,
  LoadOptionsFromUIHandler,
  SaveOptionsHandler,
} from '@/types/eventHandler'

export default function useOptions(isApp?: boolean) {
  function updateOptions(keyValue: { [T in keyof Options]?: Options[T] }) {
    console.log('updateOptions', {
      ...useStore.getState(),
      ...keyValue,
    })

    // Storeを更新
    useStore.setState({ ...useStore.getState(), ...keyValue })
  }

  function loadOptionsFromMain() {
    return new Promise<Options>(resolve => {
      console.log('loadOptionsFromMain')

      once<LoadOptionsFromMainHandler>(
        'LOAD_OPTIONS_FROM_MAIN',
        (options: Options) => {
          updateOptions(options)
          resolve(options)
        },
      )

      emit<LoadOptionsFromUIHandler>('LOAD_OPTIONS_FROM_UI')
    })
  }

  function saveOptionsToMain(options: Options) {
    console.log('saveOptionsToMain', options)
    emit<SaveOptionsHandler>('SAVE_OPTIONS', options)
  }

  return {
    updateOptions,
    loadOptionsFromMain,
    saveOptionsToMain,
  }
}
