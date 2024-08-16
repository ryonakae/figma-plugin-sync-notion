/** @jsx h */
import { h } from 'preact'

import { Container, VerticalSpace } from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import { useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

export default function Settings() {
  const options = useOptions()
  const { resizeWindow } = useResizeWindow()

  useMount(() => {
    console.log('Settings mounted')

    window.requestAnimationFrame(resizeWindow)
  })

  useUnmount(() => {
    console.log('Settings unmounted')
  })

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <h1>Settings</h1>
      <div>ほげほげ</div>

      <VerticalSpace space="medium" />
    </Container>
  )
}
