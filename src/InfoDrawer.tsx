import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { View, Text } from 'react-native'
import { DrawerItemsProps } from 'react-navigation'
import { AppState, selectName } from './redux'

const InfoContainer = styled<any>(View)`
  background-color: white;
  padding-top: 24px;
  flex: 1;
`

const Header = styled<any>(View)`
  padding: 16px 16px 8px 16px;
`

const SignedInAs = styled<any>(Text)`
  font-size: 11px;
  opacity: 0.6;
`

const Name = styled<any>(Text)`
  font-size: 18px;
  font-weight: bold;
`

type Props = {
  name: string
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
      </InfoContainer>
    )
  }
}

export const InfoDrawer = connect(
  (state: AppState) => ({
    name: selectName(state),
  }),
  null,
)(UnconnectedInfoDrawer)
