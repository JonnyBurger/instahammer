import React from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components';
import {SULZER} from './colors';
import {LitAnimation} from './LitAnimation';

const Title = styled(Text)``;

export class Form extends React.Component {
	render() {
		return (
			<View style={{padding: 30}}>
				<View style={{height: 30}} />
				<LitAnimation delay={0} type="time" />
				<View style={{height: 10}} />
				<LitAnimation delay={2000} type="location" />
			</View>
		);
	}
}
