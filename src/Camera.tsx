import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Camera, Permissions} from 'expo';
import SnapButton from './SnapButton';
import {FocalPoint} from './FocalPoint';
import {Results} from './Result';

class CameraView extends React.Component {
	state = {
		type: Camera.Constants.Type.back,
		hasCameraPermission: null
	};
	async componentDidMount() {
		const {status} = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({hasCameraPermission: status === 'granted'});
	}
	ref: React.Ref<Results> | null = null;
	render() {
		return (
			<View style={{flex: 1}}>
				<Camera style={{flex: 1}} type={this.state.type}>
					<View
						style={{
							flex: 1
						}}
					/>
					<View
						style={{
							...StyleSheet.absoluteFillObject,
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<FocalPoint />
					</View>
					<View style={{flexDirection: 'row', justifyContent: 'center'}}>
						<SnapButton
							onPress={() => {
								// @ts-ignore
								this.ref.didClick();
							}}
						/>
					</View>
					<View style={{height: 30}} />
					<Results
						ref={ref => {
							// @ts-ignore

							this.ref = ref;
						}}
					/>
				</Camera>
			</View>
		);
	}
}

export default CameraView;
