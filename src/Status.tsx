import * as React from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components'

const StatusWrapper = styled(View)<{ resolved: boolean }>`
  padding: 2px 4px;
  background-color: ${props => (props.resolved ? '#ccffb3' : '#ffcccc')};
  margin-left: 8px;
  border-radius: 4px;
`

const StatusText = styled(Text)<{ resolved: boolean }>`
  color: ${props => (props.resolved ? ' #226600' : '#990000')};
  font-size: 11px;
`

export type Props = {
  resolved: boolean
}

export class Status extends React.Component<Props> {
  render() {
    const { resolved } = this.props
    return (
      <StatusWrapper resolved={resolved}>
        <StatusText resolved={resolved}>
          {resolved ? 'Resolved' : 'Unresolved'}
        </StatusText>
      </StatusWrapper>
    )
  }
}
