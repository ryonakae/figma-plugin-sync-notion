/** @jsx h */
import { h } from 'preact'

import { Container, VerticalSpace } from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import { useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

export default function Utilities() {
  const options = useStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()

  useMount(() => {
    console.log('Utilities mounted')
    resizeWindow()
  })

  useUnmount(() => {
    console.log('Utilities unmounted')
  })

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <h1>Utilities</h1>
      <div>ほげほげ</div>

      <VerticalSpace space="medium" />
    </Container>
  )
}
