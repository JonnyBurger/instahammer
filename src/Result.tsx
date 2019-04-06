import React from 'react';
import {
	View,
	Dimensions,
	TouchableWithoutFeedback,
	TouchableOpacity,
	ActivityIndicator,
	Text
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import {CancelButton} from './CancelButton';

const screenHeight = Dimensions.get('window').height;
const previewHeight = 200;

export class Results extends React.Component {
	ref: React.Ref<BottomSheet> | null = null;
	state = {
		resultLoaded: false
	};
	snapPosition = new Animated.Value(0);
	renderInner = () => {
		return (
			<TouchableWithoutFeedback onPress={() => {}}>
				<View
					style={{
						height: screenHeight - previewHeight,
						backgroundColor: 'white'
					}}
				/>
			</TouchableWithoutFeedback>
		);
	};
	renderHeader = () => {
		return (
			<TouchableWithoutFeedback
				onPress={() => {
					// @ts-ignore
					this.ref.snapTo(0);
				}}
				style={{height: previewHeight}}
			>
				<View
					style={{
						height: previewHeight,
						backgroundColor: 'white',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<TouchableOpacity
						style={{position: 'absolute', right: 0, top: 0, padding: 10}}
						onPress={() => {
							// @ts-ignore
							this.ref.snapTo(2);
						}}
					>
						<CancelButton />
					</TouchableOpacity>
					{this.state.resultLoaded ? (
						<View>
							<Text>Hammer</Text>
						</View>
					) : (
						<ActivityIndicator color="gray" />
					)}
				</View>
			</TouchableWithoutFeedback>
		);
	};
	didClick = () => {
		if (this.ref !== null) {
			// @ts-ignore
			this.ref.snapTo(1);
			setTimeout(() => {
				this.setState({
					resultLoaded: true
				});
			}, 2000);
		}
	};
	render() {
		return (
			<>
				<Animated.Code>
					{() =>
						Animated.block([
							Animated.call([this.snapPosition], ([position]) => {
								if (position > 0.98) {
									this.props.onCancel();
								}
							})
						])
					}
				</Animated.Code>
				<BottomSheet
					ref={ref => {
						// @ts-ignore
						this.ref = ref;
					}}
					callbackNode={this.snapPosition}
					snapPoints={[screenHeight, previewHeight, 0]}
					initialSnap={2}
					renderContent={this.renderInner}
					renderHeader={this.renderHeader}
				/>
			</>
		);
	}
}
