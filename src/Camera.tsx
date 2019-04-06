import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import {Camera, Permissions} from 'expo';
import SnapButton from './SnapButton';
import {FocalPoint} from './FocalPoint';
import {Results} from './Result';
import {Flash} from './Flash';

const {height, width} = Dimensions.get('window');

class CameraView extends React.Component {
	state = {
		type: Camera.Constants.Type.back,
		hasCameraPermission: null,
		image: null
	};
	async componentDidMount() {
		const {status} = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({hasCameraPermission: status === 'granted'});
	}
	ref: React.Ref<Results> | null = null;
	flash: React.Ref<Flash> | null = null;
	camera: React.Ref<Camera> | null = null;
	render() {
		return (
			<View style={{flex: 1}}>
				{this.state.image ? (
					<View style={{flex: 1}}>
						<Image
							source={{
								uri: this.state.image
							}}
							style={{
								height,
								width
							}}
						/>
					</View>
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
												this.ref.didClick();
											}, 500);
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
				<Results
					onCancel={() => {
						this.setState({
							image: null
						});
					}}
					ref={ref => {
						// @ts-ignore
						this.ref = ref;
					}}
				/>
			</View>
		);
	}
}

export default CameraView;
