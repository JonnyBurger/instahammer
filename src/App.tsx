import React from 'react'
import {Font, AppLoading} from 'expo';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Provider, connect } from 'react-redux'

import { Explore } from './Explore'
import Camera from './Camera'
import {
  store,
  AppState,
  setAuthChecked,
  login,
  selectAuthenticationState,
} from './redux'
import { DataAsync } from './DataSync'
import { AsyncStorage, View } from 'react-native'
import { AuthenticationStateType } from './types'

import { Login } from './Login'
import { AUTH_DATA_PATH } from './constants'

const AuthenticatedNavigator = createAppContainer(
  createStackNavigator(
    {
      Camera,
      Explore,
    },
    {
      initialRouteName: 'Explore',
    },
  ),
)

const UnauthenticatedNavigator = createAppContainer(
  createStackNavigator(
    {
      Login,
    },
    {
      initialRouteName: 'Login',
    },
  ),
)

const Authenticated = DataAsync(AuthenticatedNavigator)

class UnconnectedAsyncLoader extends React.Component<{
  login: (props: { username: string; password: string }) => void
  setAuthChecked: () => void
  authenticationState: AuthenticationStateType
}> {
  componentDidMount() {
    AsyncStorage.getItem(AUTH_DATA_PATH).then(auth => {
      if (auth) {
        this.props.login((JSON.parse(auth) as unknown) as {
          username: string
          password: string
        })
      } else {
        this.props.setAuthChecked()
      }
    })
  }

  render() {
    if (
      this.props.authenticationState === AuthenticationStateType.Initializing
    ) {
      return <AppLoading />
    }

    if (
      this.props.authenticationState === AuthenticationStateType.Authenticated
    ) {
      return <Authenticated />
    }

    return <UnauthenticatedNavigator />
  }
}

const AsyncLoader = connect(
  (state: AppState) => ({
    authenticationState: selectAuthenticationState(state),
  }),
  { setAuthChecked, login },
)(UnconnectedAsyncLoader)

export class Entry extends React.Component<{}, { fontLoaded: boolean}> {

  state = {
		fontLoaded: false
	};
	async componentDidMount() {
		await Font.loadAsync({
			frutiger: require('../assets/frutiger.ttf'),
			'frutiger-bold': require('../assets/Frutiger_bold.ttf')
		});
		this.setState({
			fontLoaded: true
		});
	}
  render() {
    if (!this.state.fontLoaded) {
			return <View />;
		}
    return (
      <Provider store={store}>
        <AsyncLoader />
      </Provider>
    )
  }
}

export default Entry
