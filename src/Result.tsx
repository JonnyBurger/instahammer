import React from 'react';
import {
	View,
	Dimensions,
	TouchableWithoutFeedback,
	TouchableOpacity
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import {CancelButton} from './CancelButton';

const screenHeight = Dimensions.get('window').height;
const previewHeight = 200;

export class Results extends React.Component {
	ref: React.Ref<BottomSheet> | null = null;
	renderInner = () => {
		return (
			<TouchableWithoutFeedback onPress={() => {}}>
				<View
					style={{
						height: screenHeight - previewHeight,
						backgroundColor: 'gray'
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
				<View style={{height: previewHeight, backgroundColor: 'white'}}>
					<TouchableOpacity
						style={{position: 'absolute', right: 0, top: 0, padding: 10}}
						onPress={() => {
							this.ref.snapTo(2);
						}}
					>
						<CancelButton />
					</TouchableOpacity>
				</View>
			</TouchableWithoutFeedback>
		);
	};
	didClick = () => {
		if (this.ref !== null) {
			// @ts-ignore
			this.ref.snapTo(1);
		}
	};
	render() {
		return (
			<BottomSheet
				ref={ref => {
					// @ts-ignore
					this.ref = ref;
				}}
				snapPoints={[screenHeight, 150, 0]}
				initialSnap={2}
				renderContent={this.renderInner}
				renderHeader={this.renderHeader}
			/>
		);
	}
}
