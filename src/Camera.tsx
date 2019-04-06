import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native'
import { Camera, Permissions } from 'expo'
import BottomSheet from 'reanimated-bottom-sheet'
import Animated from 'react-native-reanimated'
import SnapButton from './SnapButton'
import { FocalPoint } from './FocalPoint'
import { Flash } from './Flash'
import { CancelButton } from './CancelButton'
import { Form } from './Form'
import { SheetHeader } from './SheetHeader'

const { height, width } = Dimensions.get('window')

const screenHeight = height - 100
export const fillRatio = screenHeight / height
const aspectRatio = height / width
const previewHeight = 130
const padding = 30
const thumbnailHeight = previewHeight - padding

let lastPosition = null

const getVision = image =>
  fetch(`http://instahammer.herokuapp.com/v1/vision`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      image,
    }),
  }).then(response => response.json())

class CameraView extends React.Component {
  state = {
    type: Camera.Constants.Type.back,
    hasCameraPermission: null,
    image: null,
    resultLoaded: false,
    showForm: false,
    base64: null,
  }
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }
  ref: React.Ref<Results> | null = null
  flash: React.Ref<Flash> | null = null
  camera: React.Ref<Camera> | null = null
  contentPosition = new Animated.Value(0)
  bottomSheet: React.Ref<BottomSheet> | null = null
  form: React.Ref<Form> | null = null
  snapPosition = new Animated.Value(1)
  renderInner = () => {
    return (
      <TouchableWithoutFeedback onPress={() => {}}>
        <View
          style={{
            height: screenHeight - previewHeight,
            width: '100%',
          }}
        >
          <View style={{ flex: 1 }}>
            <Form
              base64={this.state.base64}
              ref={form => {
                this.form = form
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
  renderHeader = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          // @ts-ignore
          if (lastPosition > 0.5) {
            this.bottomSheet.snapTo(0)
          } else {
            this.bottomSheet.snapTo(1)
          }
        }}
        style={{
          height: previewHeight,
        }}
      >
        <View
          style={{
            flex: 1,
            height: previewHeight,
            backgroundColor: 'white',
            justifyContent: 'center',
            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
            borderBottomWidth: 1,
          }}
        >
          <SheetHeader
            position={this.snapPosition}
            result={this.state.resultLoaded}
            onCancel={() => {
              this.bottomSheet.snapTo(2)
            }}
            onMoveDown={() => {
              if (lastPosition > 0.5) {
                this.bottomSheet.snapTo(0)
              } else {
                this.bottomSheet.snapTo(1)
              }
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.image ? (
          <Animated.View
            style={{
              flex: 1,
              transform: [
                {
                  translateY: Animated.sub(
                    Animated.multiply(screenHeight, this.snapPosition),
                    screenHeight,
                  ),
                },
              ],
            }}
          >
            <Image
              source={{
                uri: this.state.image,
              }}
              style={{
                height,
                width,
              }}
            />
          </Animated.View>
        ) : (
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={camera => {
              this.camera = camera
            }}
          >
            <View
              style={{
                flex: 1,
              }}
            />
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -80,
              }}
            >
              <FocalPoint />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <SnapButton
                onPress={() => {
                  this.setState({
                    resultLoaded: false,
                  })
                  // @ts-ignore
                  this.camera
                    .takePictureAsync({
                      quality: 0.5,
                      base64: true,
                    })
                    .then(result => {
                      this.setState({
                        image: result.uri,
                        base64: `data:image/png;base64,${result.base64}`,
                      })
                      // @ts-ignore
                      this.bottomSheet.snapTo(1)
                      getVision(`data:image/png;base64,${result.base64}`).then(
                        result => {
                          console.log(result)
                          this.setState({
                            resultLoaded: result,
                          })
                        },
                      )
                    })
                  this.flash.flash()
                }}
              />
            </View>
            <View style={{ height: 30 }} />
            <Flash
              ref={flash => {
                // @ts-ignore
                this.flash = flash
              }}
            />
          </Camera>
        )}
        <Animated.Code>
          {() =>
            Animated.block([
              Animated.call([this.snapPosition], ([position]) => {
                if (
                  position > 0.98 &&
                  lastPosition <= 0.98 &&
                  lastPosition !== null
                ) {
                  const options = [
                    {
                      text: 'No',
                      onPress: () => {
                        this.bottomSheet.snapTo(1)
                      },
                    },
                    {
                      text: 'Yes',
                      onPress: () => {
                        this.setState({ image: null })
                      },
                    },
                  ]
                  Alert.alert('Do you want to discard the photo?', '', options)
                }
                if (position < 0.01 && lastPosition >= 0.01) {
                  this.form.trigger()
                }
                lastPosition = position
              }),
            ])
          }
        </Animated.Code>
        <BottomSheet
          ref={ref => {
            // @ts-ignore
            this.bottomSheet = ref
          }}
          overdragResistanceFactor={1}
          callbackNode={this.snapPosition}
          snapPoints={[screenHeight, previewHeight, 0]}
          initialSnap={2}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
        />
      </View>
    )
  }
}

export default CameraView
