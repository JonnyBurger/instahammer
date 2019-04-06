import React from 'react';
import {View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import styled from 'styled-components';
import {GRAY} from './colors';

const Cancel = styled(View)`
	height: 30px;
	width: 30px;
	border-radius: 15px;
	background-color: ${GRAY};
	justify-content: center;
	align-items: center;
	padding-top: 2px;
	padding-left: 0.5px;
`;

export class CancelButton extends React.Component {
	render() {
		return (
			<Cancel>
				<MaterialCommunityIcons
					name="window-close"
					color="rgba(0, 0, 0, 0.4)"
					size={20}
				/>
			</Cancel>
		);
	}
}
