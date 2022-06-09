import { css } from '@emotion/react'
import { Property } from 'csstype'
import React from 'react'

type HStackProps = JSX.IntrinsicElements['div'] & {
  align?: Property.AlignItems
  justify?: Property.JustifyContent
}

const HStack: React.FC<HStackProps> = ({
  align = 'center',
  justify = 'inherit',
  children,
  ...delegated
}) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        align-items: ${align};
        justify-content: ${justify};
      `}
      {...delegated}
    >
      {children}
    </div>
  )
}

export default HStack
