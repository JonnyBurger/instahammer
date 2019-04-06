import * as React from 'react';
import {View, StatusBar} from 'react-native';
import Camera from './Camera';
import {Form} from './Form';

export default () => (
	<View style={{flex: 1}}>
		<StatusBar backgroundColor="white" barStyle="light-content" />
		{/**
		<Camera />
		 */}
		<Form />
	</View>
);
