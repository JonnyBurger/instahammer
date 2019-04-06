import * as React from 'react'
import { View, StatusBar, Button } from 'react-native'
import styled from 'styled-components'
import { headerStyle } from './style'
import { connect } from 'react-redux'
import { AppState, login } from './redux'

const LoginWrapper = styled<any>(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: white;
  width: 100%;
`

type Props = {
  login: (props: { username: string; password: string }) => void
}

class Login extends React.Component<Props> {
  static navigationOptions = (props: any) => {
    return {
      ...headerStyle,
      title: 'Login',
    }
  }

  render() {
    return (
      <LoginWrapper>
        <StatusBar barStyle="light-content" />
        <Button
          onPress={() =>
            this.props.login({
              username: 'lukaszirngibl',
              password: 'EiBd89zukn?',
            })
          }
          title="Login"
        >
          Login
        </Button>
      </LoginWrapper>
    )
  }
}

const Connected = connect(
  (state: AppState) => ({
    loginError: '',
  }),
  { login },
)(Login)

export { Connected as Login }
