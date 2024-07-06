import { emit } from '@create-figma-plugin/utilities'

import type { ResizeWindowHandler } from '@/types/eventHandler'

export default function useResizeWindow() {
  function resizeWindow() {
    let height: number

    const wrapper = document.getElementById('wrapper')

    if (wrapper) {
      height = wrapper.clientHeight
    } else {
      height = 0
    }

    emit<ResizeWindowHandler>('RESIZE_WINDOW', {
      width: 300,
      height,
    })
  }

  return { resizeWindow }
}
