import React from 'react'
import { View, TextInput } from 'react-native'
import styled from 'styled-components'
import { LitAnimation } from './LitAnimation'
import { Button } from './Button'
import { Suggestions } from './Suggestions'

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
  state = {
    description: '',
    title: '',
    sending: false,
  }
  render() {
    return (
      <View style={{ padding: 20, flex: 1 }}>
        <View style={{ height: 5 }} />
        <Title
          placeholder="Enter title"
          value={this.state.title}
          onChangeText={title => {
            this.setState({ title })
          }}
        />
        <View style={{ height: 10 }} />
        <Description
          onChangeText={description => {
            this.setState({ description })
          }}
          value={this.state.description}
          placeholder={`Describe your inquiry about ${this.props.term}`}
        />
        <View style={{ height: 25 }} />
        <View style={{ flex: 1 }} />
        <Suggestions
          term={this.props.term}
          select={description => {
            this.setState({
              description: description,
            })
          }}
        />
        <View style={{ height: 10 }} />
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
          isLoading={this.state.sending}
          label="Create report"
          onPress={() => {
            this.setState({
              sending: true,
            })
            fetch(`http://instahammer.herokuapp.com/v1/posts`, {
              method: 'post',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                title: this.state.title || `Question about ${this.props.term}`,
                description: this.state.description || ' ',
                location: {
                  latitude: 47.5056,
                  longitude: 8.7241,
                },
                author: 'Jonny Burger',
                postTags: [this.props.term, ...this.props.alternativeTerms],
                image: this.props.base64,
                imageTags: [],
              }),
            })
              .then(response => response.json())
              .then(response => {
                this.setState({
                  sending: false,
                  title: '',
                  description: '',
                })
                // alert(
                //   "Call here `this.props.addPost` and fix reducer! I don't know how to use options arghh!! ",
                // )
                this.props.addPost(response)
                this.props.setSelectedPost(response.id)
                this.props.navigation.navigate('PostDetail')
              })
          }}
        />
      </View>
    )
  }
}
