import React from 'react';
import {View, Text, Animated, Easing, ActivityIndicator} from 'react-native';
import styled from 'styled-components';
import {LinearGradient} from 'expo';
import {format} from 'date-fns';
import {Entypo, MaterialCommunityIcons} from '@expo/vector-icons';
import {SULZER} from './colors';

const Title = styled(Text)``;

const IconContainer = styled(LinearGradient).attrs({
	colors: [SULZER, '#5191f7'],
	start: [0, 1],
	end: [1, 1]
})`
	height: 30px;
	width: 30px;
	background-color: ${SULZER};
	border-radius: 15px;
	justify-content: center;
	align-items: center;
	padding-top: 1px;
`;

export class LitIcon extends React.Component<{
	delay: number;
	type: 'time' | 'location';
}> {
	animation = new Animated.Value(-24);
	componentDidMount() {
		setTimeout(() => {
			Animated.timing(this.animation, {
				toValue: 0,
				duration: 150,
				easing: Easing.in(Easing.ease),
				useNativeDriver: true
			}).start();
		}, 1000 + this.props.delay);
	}
	render() {
		return (
			<IconContainer>
				<Animated.View
					style={{
						transform: [
							{
								translateX: this.animation
							}
						]
					}}
				>
					{this.props.type === 'location' ? (
						<Entypo name="location-pin" color="white" size={20} />
					) : (
						<MaterialCommunityIcons
							name="clock-outline"
							color="white"
							size={20}
						/>
					)}
				</Animated.View>
			</IconContainer>
		);
	}
}

export class LitAnimation extends React.Component<{
	delay: number;
	type: 'time' | 'location';
}> {
	animation = new Animated.Value(0);
	componentDidMount() {
		setTimeout(() => {
			Animated.timing(this.animation, {
				toValue: 1,
				duration: 200,
				easing: Easing.ease
			}).start();
		}, 1200 + this.props.delay);
	}

	render() {
		return (
			<View style={{flexDirection: 'row', alignItems: 'center'}}>
				<LitIcon delay={this.props.delay} type={this.props.type} />
				<View style={{width: 7}} />
				<Animated.Text
					style={{
						opacity: this.animation.interpolate({
							inputRange: [0, 1],
							outputRange: [1, 0]
						}),
						position: 'absolute',
						marginLeft: 40
					}}
				/>
				<Animated.Text
					style={{
						marginTop: 1,
						fontFamily: 'frutiger',
						fontSize: 16,
						transform: [
							{
								translateY: this.animation.interpolate({
									inputRange: [0, 1],
									outputRange: [5, 0]
								})
							}
						],
						opacity: this.animation
					}}
				>
					{this.props.type === 'location' ? (
						<Text>
							<Text style={{fontFamily: 'frutiger-bold'}}>Winterthur</Text>{' '}
							<Text style={{fontFamily: 'frutiger'}}>Switzerland</Text>
						</Text>
					) : (
						format(new Date(), 'iiii d.M.yyyy, HH:mm')
					)}
				</Animated.Text>
			</View>
		);
	}
}
