import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Camera, Permissions} from 'expo';

class CameraView extends React.Component {
	state = {
		type: Camera.Constants.Type.back,
		hasCameraPermission: null
	};
	async componentDidMount() {
		const {status} = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({hasCameraPermission: status === 'granted'});
	}
	render() {
		return (
			<View style={{flex: 1}}>
				<Camera style={{flex: 1}} type={this.state.type}>
					<View
						style={{
							flex: 1,
							backgroundColor: 'transparent',
							flexDirection: 'row'
						}}
					/>
				</Camera>
			</View>
		);
	}
}

export default CameraView;
