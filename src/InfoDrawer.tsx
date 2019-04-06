import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { View, Text } from 'react-native'
import { DrawerItemsProps } from 'react-navigation'
import { AppState, selectName, logout } from './redux'
import { Button } from './Button'

const InfoContainer = styled<any>(View)`
  background-color: white;
  padding: 24px 8px 0px 8px;
  flex: 1;
`

const Header = styled<any>(View)`
  padding: 16px 16px 8px 16px;
`

const SignedInAs = styled<any>(Text)`
  font-size: 11px;
  opacity: 0.6;
  margin-top: 16px;
`

const Name = styled<any>(Text)`
  font-size: 18px;
  font-weight: bold;
  margin-top: 6px;
`

type Props = {
  name: string
  logout: () => void
}

class UnconnectedInfoDrawer extends React.Component<Props & DrawerItemsProps> {
  render() {
    const { name } = this.props
    return (
      <InfoContainer>
        <Header>
          <SignedInAs>Signed in as</SignedInAs>
          <Name>{name}</Name>
        </Header>
        <Button
          label="Logout"
          onPress={this.props.logout}
          css={{ margin: 12 }}
        />
      </InfoContainer>
    )
  }
}

export const InfoDrawer = connect(
  (state: AppState) => ({
    name: selectName(state),
  }),
  { logout },
)(UnconnectedInfoDrawer)
