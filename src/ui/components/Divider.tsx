import { css } from '@emotion/react'
import React from 'react'
import { color } from '@/ui/styles'

type DividerProps = JSX.IntrinsicElements['div'] & {
  direction?: 'column' | 'row'
}

const Divider: React.FC<DividerProps> = ({
  direction = 'row',
  ...delegated
}) => {
  const width = direction === 'column' ? '1px' : '100%'
  const height = direction === 'row' ? '1px' : '100%'

  return (
    <div
      css={css`
        background-color: ${color.border};
        width: ${width};
        height: ${height};
      `}
      {...delegated}
    />
  )
}

export default Divider
