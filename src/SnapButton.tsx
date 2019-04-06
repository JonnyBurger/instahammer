import React from 'react';
import styled from 'styled-components';
import {View} from 'react-native';
import {SULZER} from './colors';

const BUTTON_WIDTH = 70;

const Outer = styled(View)`
	border-radius: ${BUTTON_WIDTH / 2 + 7}px;
	border-color: ${SULZER};
	border-width: 7px;
`;

const Button = styled(View)`
	height: ${BUTTON_WIDTH}px;
	width: ${BUTTON_WIDTH}px;
	border-radius: ${BUTTON_WIDTH / 2}px;
	background: rgba(255, 255, 255, 0.3);
`;

export default class extends React.Component {
	render() {
		return (
			<Outer>
				<Button />
			</Outer>
		);
	}
}
