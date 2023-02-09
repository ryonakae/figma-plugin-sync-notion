import { css } from '@emotion/react'
import React from 'react'
import IconCheck from '@/ui/assets/img/icon_check.inline.svg'
import IconHyphen from '@/ui/assets/img/icon_hyphen.inline.svg'
import { radius, color, size } from '@/ui/styles'

type SegmentedControlProps = JSX.IntrinsicElements['div'] & {
  state: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
  disabled?: boolean
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({
  state,
  onClick,
  disabled,
  ...delegated
}) => {
  return (
    <div
      css={[
        css`
          position: relative;
          display: flex;
          border: ${radius.segmentedControl} solid transparent;

          &:hover {
            &::before {
              position: absolute;
              width: 100%;
              height: 100%;
              content: '';
              border: 1px solid ${color.segmentedControl};
              border-radius: ${radius.segmentedControl};
            }
          }
        `,
        disabled &&
          css`
            pointer-events: none;
            opacity: 0.3;
          `
      ]}
      onClick={onClick}
      {...delegated}
    >
      <div
        css={[
          css`
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${size.segmentedControl};
            height: ${size.segmentedControl};
            border-radius: ${radius.segmentedControl};
          `,
          !state &&
            css`
              background-color: ${color.segmentedControl};
            `
        ]}
      >
        <IconHyphen
          css={css`
            width: ${size.icon};
            height: ${size.icon};
          `}
        />
      </div>
      <div
        css={[
          css`
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${size.segmentedControl};
            height: ${size.segmentedControl};
            border-radius: ${radius.segmentedControl};
          `,
          state &&
            css`
              background-color: ${color.segmentedControl};
            `
        ]}
      >
        <IconCheck
          css={css`
            width: ${size.icon};
            height: ${size.icon};
          `}
        />
      </div>
    </div>
  )
}

export default SegmentedControl
