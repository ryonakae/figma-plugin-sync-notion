import { css } from '@emotion/react'
import React from 'react'
import HStack from '@/ui/components/HStack'
import Spacer from '@/ui/components/Spacer'
import VStack from '@/ui/components/VStack'
import { radius, color, size, spacing } from '@/ui/styles'

type InputProps = JSX.IntrinsicElements['div'] & {
  title: React.ReactNode
  rightContent?: React.ReactNode
  type: React.InputHTMLAttributes<HTMLInputElement>['type']
  value: React.InputHTMLAttributes<HTMLInputElement>['value']
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder']
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

const Input: React.FC<InputProps> = ({
  title,
  rightContent,
  type,
  value,
  placeholder,
  onChange,
  ...delegated
}) => {
  return (
    <VStack {...delegated}>
      <HStack justify="space-between">
        <span
          css={css`
            color: ${color.subText};
          `}
        >
          {title}
        </span>
        {rightContent && rightContent}
      </HStack>
      <Spacer y={spacing[1]} />
      <input
        css={css`
          height: ${size.input};
          border: 1px solid ${color.input};
          border-radius: ${radius.input};
          padding: 0 ${spacing[2]};

          &:hover {
            border-color: ${color.inputHover};
          }
          &:focus {
            border: 2px solid ${color.primary};
            margin: 0 -1px;
          }
        `}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </VStack>
  )
}

export default Input
