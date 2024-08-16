import type { Options } from '@/types/common'
import { useStore } from '@/ui/Store'

export default function useOptions() {
  function updateOptions(keyValue: { [T in keyof Options]?: Options[T] }) {
    console.log('updateOptions', {
      ...useStore.getState(),
      ...keyValue,
    })
    useStore.setState({ ...useStore.getState(), ...keyValue })
  }

  return { updateOptions }
}
