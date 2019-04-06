import * as React from 'react';
import {View, StatusBar} from 'react-native';
import Camera from './Camera';

export default () => (
	<View style={{flex: 1}}>
		<StatusBar backgroundColor="white" barStyle="light-content" />
		<Camera />
	</View>
);
