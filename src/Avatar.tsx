import * as React from 'react'
import { View, Image } from 'react-native'
import styled from 'styled-components'

const AvatarWrapper = styled(View)`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  overflow: hidden;
`

const AvatarImage = styled(Image)`
  width: 36px;
  height: 36px;
`

export class Avatar extends React.Component {
  render() {
    return (
      <AvatarWrapper>
        <AvatarImage source={require('./avatar-1.jpg')} />
      </AvatarWrapper>
    )
  }
}
