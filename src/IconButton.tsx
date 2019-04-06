import * as React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import styled, { SimpleInterpolation } from 'styled-components'

const IconButtonWrapper = styled(TouchableOpacity)<{
  css: SimpleInterpolation
}>`
  padding: 8px;

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
    const { onPress, source, css, chromeless, rotate, iconStyle } = this.props
    return (
      <IconButtonWrapper onPress={onPress} css={css}>
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
