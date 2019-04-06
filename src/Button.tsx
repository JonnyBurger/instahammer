import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import styled, { SimpleInterpolation } from 'styled-components'
import { lighten } from 'polished'
import { LinearGradient } from 'expo'
import { SULZER, GRAY } from './colors'

const Container = styled(TouchableOpacity)<{ css: SimpleInterpolation }>`
  height: 50px;

  ${props => props.css}
`

const Inner = styled(LinearGradient).attrs(props => ({
  colors: props.gray ? [GRAY, GRAY] : [SULZER, lighten(0.2, SULZER)],
  start: [0, 1],
  end: [1, 1],
}))`
  flex: 1;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`

const Label = styled(Text)<{ isLoading: boolean }>`
  color: white;
  font-family: 'frutiger-bold';
  font-size: 16px;
  margin-right: ${props => (props.isLoading ? 16 : 0)};
`

export class Button extends React.Component<{
  onPress: () => void
  label: any
  css?: SimpleInterpolation
  isLoading?: boolean
}> {
  render() {
    return (
      <Container onPress={this.props.onPress} css={this.props.css}>
        <Inner gray={this.props.gray}>
          <Label isLoading={this.props.isLoading}>{this.props.label}</Label>
          {this.props.isLoading && (
            <ActivityIndicator size="small" color="white" />
          )}
        </Inner>
      </Container>
    )
  }
}
