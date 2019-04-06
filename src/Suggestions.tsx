import React from 'react'
import styled from 'styled-components'
import { View, Text, TouchableOpacity } from 'react-native'
import { GRAY } from './colors'

const Container = styled(TouchableOpacity)`
  background-color: ${GRAY};
  padding: 8px;
  border-radius: 16px;
`

const Label = styled(Text)`
  text-align: center;
  color: rgba(0, 0, 0, 0.8);
`

export class Suggestions extends React.Component {
  render() {
    return (
      <View>
        <Text style={{ textAlign: 'center', color: 'gray' }}>Suggestions</Text>
        <View style={{ height: 6 }} />
        <Container
          onPress={() =>
            this.props.select(`How do you use ${this.props.term}?`)
          }
        >
          <Label>How do you use {this.props.term}?</Label>
        </Container>
        <View style={{ height: 8 }} />
        <Container
          onPress={() =>
            this.props.select(
              `Do I need to be careful when using ${this.props.term}?`,
            )
          }
        >
          <Label>Do I need to be careful when using {this.props.term}?</Label>
        </Container>
        <View style={{ height: 8 }} />
        <Container
          onPress={() =>
            this.props.select(`Is this ${this.props.term} damaged?`)
          }
        >
          <Label>Is this {this.props.term} damaged?</Label>
        </Container>
      </View>
    )
  }
}
