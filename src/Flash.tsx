import React from 'react';
import styled from 'styled-components';
import {Animated, StyleSheet} from 'react-native';

const Overlay = styled(Animated.View)`
	background-color: white;
`;

export class Flash extends React.Component {
	opacity = new Animated.Value(0);
	flash() {
		Animated.sequence([
			Animated.timing(this.opacity, {
				toValue: 1,
				duration: 50,
				useNativeDriver: true
			}),
			Animated.timing(this.opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true
			})
		]).start();
	}
	render() {
		return (
			<Overlay
				pointerEvents="none"
				style={{
					...StyleSheet.absoluteFillObject,
					opacity: this.opacity
				}}
			/>
		);
	}
}
