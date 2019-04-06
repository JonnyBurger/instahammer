import React from 'react';
import {View, TextInput} from 'react-native';
import styled from 'styled-components';
import {SULZER} from './colors';
import {LitAnimation, Rotating} from './LitAnimation';
import {Button} from './Button';

const Title = styled(TextInput)`
	font-size: 30px;
	font-family: 'frutiger-bold';
`;

const Description = styled(TextInput)`
	font-family: 'frutiger';
	font-size: 20px;
	height: 100px;
`;
export class Form extends React.Component {
	render() {
		return (
			<View style={{padding: 30}}>
				<View style={{height: 25}} />
				<Title placeholder="Enter title" />
				<View style={{height: 10}} />
				<Description placeholder="Describe your inquiry" multiline />
				<View style={{height: 25}} />
				<LitAnimation delay={0} type="time" />
				<View style={{height: 10}} />
				<LitAnimation delay={500} type="location" />
				<View style={{height: 20}} />
				<Button />
			</View>
		);
	}
}
