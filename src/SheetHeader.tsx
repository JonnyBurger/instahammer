import React from 'react'
import styled from 'styled-components'
import { View, Text, Image, Animated } from 'react-native'
import { Rotating } from './LitAnimation'
import { LeftToRightReveal } from './LeftToRightReveal'
import { Button } from './Button'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { GRAY } from './colors'
import { FadingAvatar } from './FadingAvatar'
import Reanimated from 'react-native-reanimated'

const { concat } = Reanimated

const Container = styled(View)`
  flex: 1;
`

export class SheetHeader extends React.Component {
  state = {
    loading: true,
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loading: false,
      })
    }, 2000)
  }
  render() {
    const rotation = Reanimated.min(
      Reanimated.max(
        0,
        Reanimated.multiply(5, Reanimated.sub(this.props.position, 0.4)),
      ),
      1,
    )
    return (
      <Container>
        {this.state.loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Rotating />
          </View>
        ) : (
          <View
            style={{
              paddingLeft: 20,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
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
              >
                Industrial Hammer
              </LeftToRightReveal>

              <LeftToRightReveal
                style={{
                  fontSize: 16,
                  fontFamily: 'frutiger-bold',
                  color: 'rgba(0, 0, 0, 0.4)',
                }}
                height={30}
              >
                6 experts may help{' '}
              </LeftToRightReveal>
              <FadingAvatar
                left={135}
                top={24}
                source={require('../assets/guy1.jpg')}
              />
              <FadingAvatar
                left={145}
                top={24}
                source={require('../assets/guy2.jpg')}
              />
              <FadingAvatar
                left={155}
                top={24}
                source={require('../assets/guy3.jpg')}
              />
            </View>
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
              }}
            />
            <View style={{ width: 20 }} />
          </View>
        )}
      </Container>
    )
  }
}
