import React from 'react'
import { Font, AppLoading } from 'expo'
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator,
} from 'react-navigation'
import { Provider, connect } from 'react-redux'

import { Explore } from './Explore'
import Camera from './Camera'
import {
  store,
  AppState,
  setAuthChecked,
  login,
  selectAuthenticationState,
  setName,
} from './redux'
import { DataAsync } from './DataSync'
import { AsyncStorage, View } from 'react-native'
import { AuthenticationStateType } from './types'
import { InfoDrawer } from './InfoDrawer'
import { Login } from './Login'
import { AUTH_DATA_PATH } from './constants'
import { PostDetail } from './PostDetail'

const CameraNavigator = createStackNavigator(
  {
    Camera,
  },
  {
    initialRouteName: 'Camera',
    headerMode: 'none',
  },
)

const ExploreNavigator = createStackNavigator(
  {
    Explore,
    PostDetail,
  },
  {
    initialRouteName: 'Explore',
  },
)

const AuthenticatedNavigator = createAppContainer(
  createDrawerNavigator(
    {
      CameraNavigator,
      ExploreNavigator,
    },
    {
      initialRouteName: 'ExploreNavigator',
      contentComponent: InfoDrawer,
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
  setName: (username: string) => void
  setAuthChecked: () => void
  authenticationState: AuthenticationStateType
}> {
  componentDidMount() {
    AsyncStorage.getItem(AUTH_DATA_PATH).then((auth: string | null) => {
      if (auth) {
        this.props.setName(
          ((JSON.parse(auth) as unknown) as {
            username: string
            password: string
          }).username,
        )
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
  { setAuthChecked, login, setName },
)(UnconnectedAsyncLoader)

export class Entry extends React.Component<{}, { fontLoaded: boolean }> {
  state = {
    fontLoaded: false,
  }
  async componentDidMount() {
    await Font.loadAsync({
      frutiger: require('../assets/frutiger.ttf'),
      'frutiger-bold': require('../assets/Frutiger_bold.ttf'),
    })
    this.setState({
      fontLoaded: true,
    })
  }
  render() {
    if (!this.state.fontLoaded) {
      return <View />
    }
    return (
      <Provider store={store}>
        <AsyncLoader />
      </Provider>
    )
  }
}

export default Entry
