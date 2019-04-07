import * as React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import styled, { SimpleInterpolation } from 'styled-components'

const IconButtonWrapper = styled(TouchableOpacity)<{
  css: SimpleInterpolation
}>`
  padding: 8px;
  padding-left: ${props => (props.left ? 0 : 8)}px
  padding-right: ${props => (props.right ? 0 : 8)}px
  ${props => props.css};
`

const Icon = styled(Image)<{
  css: SimpleInterpolation
}>`
  width: 20px;
  height: 20px;

  ${props => props.css};
`

export type IconButtonProps = {
  iconStyle?: SimpleInterpolation
  css?: SimpleInterpolation
  onPress: () => void
  source: any
  chromeless?: boolean
  rotate?: number
}

export class IconButton extends React.Component<IconButtonProps> {
  render() {
    const {
      onPress,
      source,
      css,
      chromeless,
      rotate,
      iconStyle,
      left,
      right,
    } = this.props
    return (
      <IconButtonWrapper onPress={onPress} css={css} left={left} right={right}>
        <Icon
          source={source}
          css={iconStyle}
          style={{
            transform: [
              {
                rotate: `${rotate || 0}deg`,
              },
            ],
          }}
        />
      </IconButtonWrapper>
    )
  }
}
