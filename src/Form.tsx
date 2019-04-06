import React from 'react'
import { View, TextInput } from 'react-native'
import styled from 'styled-components'
import { SULZER } from './colors'
import { LitAnimation, Rotating } from './LitAnimation'
import { Button } from './Button'

const Title = styled(TextInput)`
  font-size: 30px;
  font-family: 'frutiger-bold';
`

const Description = styled(TextInput)`
  font-family: 'frutiger';
  font-size: 20px;
  height: 50px;
`
export class Form extends React.Component {
  trigger() {
    this.anim1.trigger()
    this.anim2.trigger()
  }
  render() {
    return (
      <View style={{ padding: 20, flex: 1 }}>
        <View style={{ height: 5 }} />
        <Title placeholder="Enter title" />
        <View style={{ height: 10 }} />
        <Description placeholder="Describe your inquiry" />
        <View style={{ height: 25 }} />
        <View style={{ flex: 1 }} />
        <LitAnimation
          ref={anim => {
            this.anim1 = anim
          }}
          delay={0}
          type="time"
        />
        <View style={{ height: 10 }} />
        <LitAnimation
          ref={anim => {
            this.anim2 = anim
          }}
          delay={1000}
          type="location"
        />
        <View style={{ height: 10 }} />
        <Button label="Create report" />
      </View>
    )
  }
}
