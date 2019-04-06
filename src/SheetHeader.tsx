import React from 'react'
import styled from 'styled-components'
import {
  View,
  Text,
  Image,
  Animated,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Rotating } from './LitAnimation'
import { LeftToRightReveal } from './LeftToRightReveal'
import { Button } from './Button'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { GRAY } from './colors'
import { FadingAvatar } from './FadingAvatar'
import Reanimated from 'react-native-reanimated'
import { Experts } from './Experts'

const { concat } = Reanimated

const Container = styled(View)`
  flex: 1;
`

const OtherSuggestions = styled(ScrollView).attrs({
  horizontal: true,
})`
  height: 30px;
  position: absolute;
  top: 75px;
  left: 20px;
`

const Tag = styled(TouchableOpacity)`
  background: ${GRAY};
  padding: 6px;
  justify-content: center;
  align-items: center;
  margin-right: 6px;
  border-radius: 3px;
  padding-left: 6px;
  padding-right: 6px;
`

export class SheetHeader extends React.Component {
  state = {
    selectedTerm: null,
  }
  render() {
    const rotation = Reanimated.min(
      Reanimated.max(
        0,
        Reanimated.multiply(5, Reanimated.sub(this.props.position, 0.4)),
      ),
      1,
    )

    if (!this.props.result) {
      return (
        <Container>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Rotating />
          </View>
        </Container>
      )
    }
    let otherResult = []
    const [mainResult] = this.props.result.webTags
    if (this.props.result.webTags.length > 1) {
      otherResult.push(this.props.result.webTags[1])
    }
    if (this.props.result.textTags.length > 0) {
      otherResult.push(this.props.result.textTags[0])
    }
    if (this.props.result.webTags.length > 2) {
      otherResult.push(this.props.result.webTags[2])
    }
    const term = this.state.selectedTerm || mainResult
    const alternativeTerms =
      !this.state.selectedTerm || this.state.selectedTerm === mainResult
        ? otherResult
        : [mainResult, ...otherResult]
    return (
      <Container>
        <View
          style={{
            paddingLeft: 20,
            flex: 1,
            flexDirection: 'row',
            paddingTop: 20,
          }}
        >
          <View style={{ flex: 1 }}>
            <LeftToRightReveal
              style={{
                fontSize: 24,
                fontFamily: 'frutiger-bold',
                color: 'rgba(0, 0, 0, 0.9)',
              }}
              height={30}
              key={term + 'title'}
            >
              {term}
            </LeftToRightReveal>
            <Experts term={term} />
          </View>
          <OtherSuggestions
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>Or:</Text>
            <View style={{ width: 8 }} />
            {alternativeTerms.slice(0, 2).map(r => (
              <Tag
                key={r}
                onPress={() => {
                  this.setState({
                    selectedTerm: r,
                  })
                }}
              >
                <Text>{r}</Text>
              </Tag>
            ))}
          </OtherSuggestions>
          <Button
            onPress={() => this.props.onMoveDown()}
            label={
              <Reanimated.View
                style={{
                  transform: [
                    {
                      rotate: concat(
                        Reanimated.multiply(Reanimated.sub(1, rotation), 180),
                        'deg',
                      ),
                    },
                    {
                      translateY: -2,
                    },
                  ],
                }}
              >
                <Feather name="chevrons-up" color="white" size={30} />
              </Reanimated.View>
            }
            css={{
              width: 40,
              height: 40,
            }}
          />
          <View style={{ width: 13 }} />
          <Button
            label={
              <MaterialCommunityIcons
                name="window-close"
                color="rgba(0, 0, 0, 0.4)"
                size={20}
              />
            }
            gray
            onPress={() => this.props.onCancel()}
            css={{
              width: 30,
              height: 30,
              marginTop: 5,
            }}
          />
          <View style={{ width: 20 }} />
        </View>
      </Container>
    )
  }
}
