import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
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
import { connect } from 'react-redux'
import { AppState, Actions } from './redux'

const { height, width } = Dimensions.get('window')

const screenHeight = height - 100
export const fillRatio = screenHeight / height
const previewHeight = 130
const padding = 30

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
    selectedTerm: null,
  }
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
    console.log(await this.camera.getAvailablePictureSizesAsync())
  }
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
              addPost={this.props.addPost}
              setSelectedPost={this.props.setSelectedPost}
              navigation={this.props.navigation}
              term={this.getResult().term}
              alternativeTerms={this.getResult().alternativeTerms}
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
  getResult = () => {
    if (!this.state.resultLoaded) {
      return {
        mainResult: [],
        alternativeTerms: [],
        term: null,
      }
    }
    let otherResult = []
    const [mainResult] = this.state.resultLoaded.webTags
    if (this.state.resultLoaded.webTags.length > 1) {
      otherResult.push(this.state.resultLoaded.webTags[1])
    }
    if (this.state.resultLoaded.textTags.length > 0) {
      otherResult.push(this.state.resultLoaded.textTags[0])
    }
    if (this.state.resultLoaded.webTags.length > 2) {
      otherResult.push(this.state.resultLoaded.webTags[2])
    }
    const term = this.state.selectedTerm || mainResult
    const alternativeTerms =
      !this.state.selectedTerm || this.state.selectedTerm === mainResult
        ? otherResult
        : [mainResult, ...otherResult]
    return {
      mainResult,
      alternativeTerms,
      term,
    }
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
            alternativeTerms={this.getResult().alternativeTerms}
            term={this.getResult().term}
            selectTerm={r => {
              this.setState({
                selectedTerm: r,
              })
            }}
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
            pictureSize="High"
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
            <View
              style={{
                paddingTop: 30,
                paddingLeft: 20,
                position: 'absolute',
                zIndex: 3,
                top: 0,
                left: 0,
              }}
            >
              <CancelButton
                onPress={() => {
                  this.props.navigation.navigate('Explore')
                }}
              />
            </View>
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

export default connect(
  (state: AppState) => ({}),
  dispatch => ({
    addPost: post =>
      dispatch({
        type: Actions.POST_ADDED,
        post,
      }),
    setSelectedPost: id =>
      dispatch({
        type: Actions.SET_SELECTED_POST,
        payload: id,
      }),
  }),
)(CameraView)
