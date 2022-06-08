import { css } from '@emotion/react'
import React from 'react'
import HStack from '@/ui/components/HStack'
import { color, spacing, radius, size } from '@/ui/styles'

type ButtonProps = JSX.IntrinsicElements['div'] & {
  type?: 'primary' | 'border' | 'ghost'
  disabled?: boolean
  padding?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const Button: React.FC<ButtonProps> = ({
  type = 'primary',
  disabled = false,
  padding = true,
  onClick = () => {
    console.log('Button onClick')
  },
  children,
  ...delegated
}) => {
  let backgroundColor!: string
  let borderColor!: string
  let textColor!: string
  let activeBorderStyle!: string
  let hoverBackgroundColor!: string
  let borderRadius!: string

  if (type === 'primary') {
    backgroundColor = disabled ? color.disabled : color.primary
    borderColor = disabled ? color.disabled : color.primary
    textColor = color.primaryButtonText
    activeBorderStyle = `2px solid ${color.primaryButtonActiveBorder}`
    hoverBackgroundColor = color.primary
    borderRadius = radius.button
  } else if (type === 'border') {
    backgroundColor = 'transparent'
    borderColor = disabled ? color.disabled : color.borderButton
    textColor = disabled ? color.disabled : color.text
    activeBorderStyle = `2px solid ${color.primary}`
    hoverBackgroundColor = 'transparent'
    borderRadius = radius.button
  } else if (type === 'ghost') {
    backgroundColor = 'transparent'
    borderColor = 'transparent'
    textColor = disabled ? color.disabled : color.text
    activeBorderStyle = `2px solid transparent`
    hoverBackgroundColor = color.ghostButtonHoverBg
    borderRadius = radius.ghostButton
  }

  return (
    <div
      css={css`
        background-color: ${backgroundColor};
        border: 1px solid ${borderColor};
        border-radius: ${borderRadius};
        min-width: ${size.button};
        height: ${size.button};
        padding: ${padding ? `0 ${spacing[3]}` : 0};
        color: ${textColor};
        pointer-events: ${disabled ? 'none' : 'auto'};

        &:hover {
          background-color: ${hoverBackgroundColor};
        }

        &:active {
          border: ${activeBorderStyle};
          padding: ${padding ? '0 11px' : 0};
        }

        & svg {
          fill: ${textColor};
        }
      `}
      onClick={onClick}
      {...delegated}
    >
      <HStack
        align={'center'}
        justify={'center'}
        css={css`
          width: 100%;
          height: 100%;
        `}
      >
        {children}
      </HStack>
    </div>
  )
}

export default Button
