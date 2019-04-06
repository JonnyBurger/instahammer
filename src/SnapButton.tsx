import React from 'react';
import styled from 'styled-components';
import Animated from 'react-native-reanimated';
import {TapGestureHandler, State} from 'react-native-gesture-handler';

const BUTTON_WIDTH = 70

const Touchable = styled(Animated.View)``;

const Outer = styled(Animated.View)`
	border-radius: ${BUTTON_WIDTH / 2 + 7}px;
	border-color: white;
	border-width: 7px;
`;

const Button = styled(Animated.View)`
	height: ${BUTTON_WIDTH}px;
	width: ${BUTTON_WIDTH}px;
	border-radius: ${BUTTON_WIDTH / 2}px;
	background: rgba(255, 255, 255, 0.3);
`;

const {
	cond,
	and,
	eq,
	neq,
	set,
	Value,
	block,
	clockRunning,
	startClock,
	spring,
	stopClock
} = Animated;

function runSpring(clock, value, dest) {
	const state = {
		finished: new Animated.Value(0),
		position: new Animated.Value(0),
		time: new Animated.Value(0),
		velocity: new Animated.Value(0)
	};

	const config = {
		damping: 3000,
		mass: 0.1,
		stiffness: 200,
		overshootClamping: true,
		restSpeedThreshold: 0.01,
		restDisplacementThreshold: 0.01,
		toValue: new Value(0)
	};

	return block([
		cond(clockRunning(clock), 0, [
			set(state.finished, 0),
			set(state.time, 0),
			set(state.position, value),
			set(config.toValue, dest),
			startClock(clock)
		]),
		spring(clock, state, config),
		set(value, state.position),
		cond(state.finished, [
			stopClock(clock),
			set(state.finished, 0),
			set(value, dest)
		]),
		state.position
	]);
}

let lastPressedValue = 0;

export default class extends React.Component<{
	onPress: () => void;
}> {
	pressed = new Animated.Value(0);
	scale = new Animated.Value(1);
	render() {
		return (
			<>
				<Animated.Code>
					{() => {
						const clock = new Animated.Clock();
						return Animated.block([
							Animated.call([this.pressed], ([pressed]) => {
								if (lastPressedValue !== pressed && pressed === 0) {
									this.props.onPress();
								}
								lastPressedValue = pressed;
							}),
							Animated.cond(
								this.pressed,
								[runSpring(clock, this.scale, 0.8)],
								[runSpring(clock, this.scale, 1)]
							)
						]);
					}}
				</Animated.Code>
				<TapGestureHandler
					minPointers={1}
					onHandlerStateChange={Animated.event([
						{
							nativeEvent: ({state, oldState}) =>
								cond(
									and(eq(state, State.BEGAN), neq(oldState, State.BEGAN)),
									[
										Animated.cond(
											Animated.neq(this.pressed, 1),
											set(this.pressed, 1)
										)
									],
									Animated.cond(
										Animated.neq(this.pressed, 0),
										set(this.pressed, 0)
									)
								)
						}
					])}
				>
					<Touchable {...this.props}>
						<Outer>
							<Button
								style={{
									transform: [
										{
											scale: this.scale
										}
									]
								}}
							/>
						</Outer>
					</Touchable>
				</TapGestureHandler>
			</>
		);
	}
}
