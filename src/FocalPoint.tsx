import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components';

const Container = styled(View)`
	height: 200px;
	width: 170px;
`;

const Square = styled(View)<{
	left?: boolean;
	right?: boolean;
	bottom?: boolean;
	top?: boolean;
}>`
	height: 14px;
	width: 14px;
	border-color: white;
	border-left-width: ${props => (props.left ? 1 : 0)}px;
	border-right-width: ${props => (props.right ? 1 : 0)}px;
	border-top-width: ${props => (props.top ? 1 : 0)}px;
	border-bottom-width: ${props => (props.bottom ? 1 : 0)}px;
`;

export class FocalPoint extends React.Component {
	render() {
		return (
			<Container>
				<View style={{flexDirection: 'row'}}>
					<View style={{height: 250}}>
						<Square top left />
						<View style={{flex: 1}} />
						<Square bottom left />
					</View>
					<View style={{flex: 1}} />
					<View>
						<Square top right />
						<View style={{flex: 1}} />
						<Square bottom right />
					</View>
				</View>
			</Container>
		);
	}
}
