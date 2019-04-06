import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styled from 'styled-components';
import {lighten} from 'polished';
import {LinearGradient} from 'expo';
import {SULZER} from './colors';

const Container = styled(TouchableOpacity)`
	height: 50px;
`;

const Inner = styled(LinearGradient).attrs({
	colors: [SULZER, lighten(0.2, SULZER)],
	start: [0, 1],
	end: [1, 1]
})`
	flex: 1;
	border-radius: 25px;
	justify-content: center;
	align-items: center;
`;

const Label = styled(Text)`
	color: white;
	font-family: 'frutiger-bold';
	font-size: 16px;
`;

export class Button extends React.Component {
	render() {
		return (
			<Container>
				<Inner>
					<Label>Submit report</Label>
				</Inner>
			</Container>
		);
	}
}
