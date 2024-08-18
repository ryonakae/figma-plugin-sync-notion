/** @jsx h */
import { h } from 'preact'

import { Container, VerticalSpace } from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import { useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

export default function List() {
  const options = useStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()

  useMount(() => {
    console.log('List mounted')

    window.requestAnimationFrame(() => resizeWindow())
  })

  useUnmount(() => {
    console.log('List unmounted')
  })

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <h1>List</h1>
      <div>ほげほげ</div>

      <VerticalSpace space="medium" />
    </Container>
  )
}
