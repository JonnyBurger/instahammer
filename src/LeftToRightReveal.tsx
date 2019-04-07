import React from 'react'
import styled from 'styled-components'
import { Text, Dimensions } from 'react-native'
import Animated, { Easing } from 'react-native-reanimated'
import { LinearGradient } from 'expo'

const { width } = Dimensions.get('window')

const End = styled(LinearGradient).attrs({
  colors: ['white', 'rgba(255, 255, 255, 0)'],
  start: [1, 0],
  end: [0, 0],
})`
  height: ${props => props.height || 40}px;
  width: 60px;
  z-index: 10;
  position: relative;
  margin-left: -60px;
`

export class LeftToRightReveal extends React.Component {
  mask = new Animated.Value(0)
  componentDidMount() {
    Animated.timing(this.mask, {
      toValue: 1,
      duration: 500,
      easing: Easing.in,
    }).start()
  }
  render() {
    return (
      <Animated.View
        style={{
          flexDirection: 'row',
          width: this.mask.interpolate({
            inputRange: [0, 1],
            outputRange: [0, width + 100],
          }),
        }}
      >
        <Text numberOfLines={1} ellipsizeMode="clip" {...this.props} />
        <Animated.View
          style={{
            opacity: this.mask.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          }}
        >
          <End height={this.props.height} />
        </Animated.View>
      </Animated.View>
    )
  }
}
