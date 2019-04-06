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
        <View style={{ height: 15 }} />
        <LitAnimation
          ref={anim => {
            this.anim2 = anim
          }}
          delay={1000}
          type="location"
        />
        <View style={{ height: 15 }} />
        <Button
          label="Create report"
          onPress={() => {
            fetch(`http://instahammer.herokuapp.com/v1/posts`, {
              method: 'post',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                title: 'Engine failure',
                description: 'yo',
                location: {
                  latitude: 47.5056,
                  longitude: 8.7241,
                },
                author: 'jonny',
                postTags: ['cruise', 'A1X070', 'engine'],
                image: this.props.base64,
                imageTags: [
                  {
                    text: 'corosion',
                    pos: {
                      x: 50,
                      y: 30,
                    },
                  },
                  {
                    text: 'cracks',
                    pos: {
                      x: 40,
                      y: 70,
                    },
                  },
                ],
              }),
            })
              .then(response => response.json())
              .then(console.log)
          }}
        />
      </View>
    )
  }
}
