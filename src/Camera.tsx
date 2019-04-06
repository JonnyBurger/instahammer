import React from 'react';
import {
	View,
	StyleSheet,
	Image,
	Dimensions,
	TouchableOpacity,
	ActivityIndicator,
	Text,
	TouchableWithoutFeedback
} from 'react-native';
import {Camera, Permissions} from 'expo';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import SnapButton from './SnapButton';
import {FocalPoint} from './FocalPoint';
import {Flash} from './Flash';
import {CancelButton} from './CancelButton';
import {Form} from './Form';

const {height, width} = Dimensions.get('window');

const screenHeight = height - 100;
const aspectRatio = height / width;
const previewHeight = 150;
const padding = 30;
const thumbnailHeight = previewHeight - padding;

let lastPosition = null;

class CameraView extends React.Component {
	state = {
		type: Camera.Constants.Type.back,
		hasCameraPermission: null,
		image: null,
		resultLoaded: false
	};
	async componentDidMount() {
		const {status} = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({hasCameraPermission: status === 'granted'});
	}
	ref: React.Ref<Results> | null = null;
	flash: React.Ref<Flash> | null = null;
	camera: React.Ref<Camera> | null = null;
	contentPosition = new Animated.Value(0);
	bottomSheet: React.Ref<BottomSheet> | null = null;
	snapPosition = new Animated.Value(1);
	renderInner = () => {
		return (
			<TouchableWithoutFeedback onPress={() => {}}>
				<View
					style={{
						height: screenHeight - previewHeight,
						width: '100%'
					}}
				>
					{this.state.resultLoaded ? (
						<View style={{flex: 1}}>
							<Form />
						</View>
					) : (
						<ActivityIndicator color="gray" />
					)}
				</View>
			</TouchableWithoutFeedback>
		);
	};
	renderHeader = () => {
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					// @ts-ignore
					this.bottomSheet.snapTo(0);
				}}
				style={{height: previewHeight}}
			>
				<View
					style={{
						height: previewHeight,
						backgroundColor: 'white',
						justifyContent: 'center'
					}}
				>
					<TouchableOpacity
						style={{position: 'absolute', right: 0, top: 0, padding: 16}}
						onPress={() => {
							// @ts-ignore
							this.bottomSheet.snapTo(2);
						}}
					>
						<CancelButton />
					</TouchableOpacity>
				</View>
			</TouchableWithoutFeedback>
		);
	};
	render() {
		return (
			<View style={{flex: 1}}>
				{this.state.image ? (
					<Animated.View
						style={{
							flex: 1,
							transform: [
								{
									translateY: Animated.sub(
										Animated.multiply(screenHeight, this.snapPosition),
										screenHeight
									)
								}
							]
						}}
					>
						<Image
							source={{
								uri: this.state.image
							}}
							style={{
								height,
								width
							}}
						/>
					</Animated.View>
				) : (
					<Camera
						style={{flex: 1}}
						type={this.state.type}
						ref={camera => {
							this.camera = camera;
						}}
					>
						<View
							style={{
								flex: 1
							}}
						/>
						<View
							style={{
								...StyleSheet.absoluteFillObject,
								justifyContent: 'center',
								alignItems: 'center',
								marginTop: -80
							}}
						>
							<FocalPoint />
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'center'}}>
							<SnapButton
								onPress={() => {
									// @ts-ignore
									this.camera
										.takePictureAsync({
											quality: 0.5
										})
										.then(result => {
											this.setState({
												image: result.uri
											});
											setTimeout(() => {
												// @ts-ignore
												this.bottomSheet.snapTo(1);
												setTimeout(() => {
													this.setState({
														resultLoaded: true
													});
												}, 2000);
											}, 1000);
										});
									this.flash.flash();
								}}
							/>
						</View>
						<View style={{height: 30}} />
						<Flash
							ref={flash => {
								// @ts-ignore
								this.flash = flash;
							}}
						/>
					</Camera>
				)}
				<Animated.Code>
					{() =>
						Animated.block([
							Animated.call([this.snapPosition], ([position]) => {
								if (position > 0.98 && lastPosition <= 0.98) {
									this.setState({
										image: null
									});
								}
								lastPosition = position;
							})
						])
					}
				</Animated.Code>
				<BottomSheet
					ref={ref => {
						// @ts-ignore
						this.bottomSheet = ref;
					}}
					overdragResistanceFactor={1}
					callbackNode={this.snapPosition}
					snapPoints={[screenHeight, previewHeight, 0]}
					initialSnap={2}
					renderContent={this.renderInner}
					renderHeader={this.renderHeader}
				/>
			</View>
		);
	}
}

export default CameraView;
