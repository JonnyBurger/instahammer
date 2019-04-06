import * as React from 'react';
import {View, StatusBar} from 'react-native';
import Camera from './Camera';
import {Form} from './Form';
import {Font} from 'expo';

export default class extends React.Component {
	state = {
		loaded: false
	};
	async componentDidMount() {
		await Font.loadAsync({
			frutiger: require('../assets/frutiger.ttf'),
			'frutiger-bold': require('../assets/Frutiger_bold.ttf')
		});
		this.setState({
			loaded: true
		});
	}
	render() {
		if (!this.state.loaded) {
			return <View />;
		}
		return (
			<View style={{flex: 1}}>
				<StatusBar backgroundColor="white" barStyle="light-content" />
				<Camera />
			</View>
		);
	}
}
