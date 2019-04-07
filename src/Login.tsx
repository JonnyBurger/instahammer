import * as React from 'react'
import {
  View,
  StatusBar,
  Image,
  TextInput,
  Text,
  KeyboardAvoidingView,
} from 'react-native'
import styled from 'styled-components'
import { headerStyle } from './style'
import { connect } from 'react-redux'
import { AppState, login, selectIsLogginIn } from './redux'
import { Button } from './Button'

const LoginWrapper = styled(KeyboardAvoidingView)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: white;
  width: 100%;
`

const AppLogo = styled(Image)`
  height: 96px;
  width: 96px;
  margin-bottom: 8px;
`

const SulzerLogo = styled(Image)`
  height: 144px;
  width: 256px;
`

const Content = styled(View)`
  max-width: 312px;
  width: 100%;
  margin: auto;
  align-items: center;
  min-width: 312px;
`

const LoginInput = styled(TextInput)`
  height: 48px;
  border-radius: 4px;
  background-color: #e8e8e8;
  font-size: 18px;
  font-weight: bold;
  width: 100%;
  margin: 8px;
  padding: 0 8px;
`

const LoginLabel = styled(Text)`
  color: black;
  opacity: 0.7;
  margin: 24px 0 2px 0;
  font-size: 12px;
  width: 100%;
  text-align: left;
`

type Props = {
  login: (props: { username: string; password: string }) => void
  isLoggingIn: boolean
}

class Login extends React.Component<
  Props,
  { username: string; password: string }
> {
  static navigationOptions = (props: any) => {
    return {
      ...headerStyle,
      title: 'Login',
    }
  }

  state = {
    username: '',
    password: '',
  }

  render() {
    return (
      <LoginWrapper behavior="position">
        <StatusBar barStyle="light-content" />
        <Content>
          <AppLogo source={require('./hammer.png')} />
          <SulzerLogo source={require('./sulzer.png')} />
          <LoginLabel>Username</LoginLabel>
          <LoginInput
            onChangeText={e => this.setState({ username: e })}
            value={this.state.username}
          />
          <LoginLabel
            onChangeText={e => this.setState({ password: e })}
            value={this.state.password}
          >
            Password
          </LoginLabel>
          <LoginInput secureTextEntry />
          <Button
            onPress={() =>
              this.props.login({
                username: this.state.username, // 'lukaszirngibl',
                password: this.state.password, // 'EiBd89zukn?',
              })
            }
            label="Login"
            css={{ maxWidth: 196, width: '100%', marginTop: 24 }}
            isLoading={this.props.isLoggingIn}
          />
        </Content>
      </LoginWrapper>
    )
  }
}

const Connected = connect(
  (state: AppState) => ({
    loginError: '',
    isLoggingIn: selectIsLogginIn(state),
  }),
  { login },
)(Login)

export { Connected as Login }
