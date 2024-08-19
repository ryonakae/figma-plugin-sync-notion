import { emit } from '@create-figma-plugin/utilities'

import { DEFAULT_WIDTH } from '@/constants'

import type { ResizeWindowHandler } from '@/types/eventHandler'

export default function useResizeWindow() {
  function resizeWindow(options?: {
    width?: number
    delay?: number
  }) {
    window.setTimeout(() => {
      const wrapper = document.getElementById('wrapper')
      const height = wrapper?.clientHeight || 0

      console.log('resizeWindow', options, wrapper, height)

      emit<ResizeWindowHandler>('RESIZE_WINDOW', {
        width: options?.width || DEFAULT_WIDTH,
        height,
      })
    }, options?.delay || 16)
  }

  return { resizeWindow }
}
