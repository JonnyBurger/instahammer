import React from 'react'
import { Image, Animated } from 'react-native'

export class FadingAvatar extends React.Component {
  anim = new Animated.Value(0)
  render() {
    const { left, top, ...otherProps } = this.props
    return (
      <Animated.Image
        {...otherProps}
        onLoad={() => {
          Animated.timing(this.anim, {
            toValue: 1,
            duration: 800,
          }).start()
        }}
        style={{
          height: 26,
          width: 26,
          borderColor: 'white',
          borderWidth: 2,
          backgroundColor: 'white',
          borderRadius: 13,
          position: 'absolute',
          zIndex: 2,
          opacity: this.anim,
          transform: [
            {
              translateX: left,
            },
            {
              translateY: top,
            },
          ],
        }}
      />
    )
  }
}
