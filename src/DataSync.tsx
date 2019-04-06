import * as React from 'react'
import { connect } from 'react-redux'

type Props = {}

export const DataAsync = (WrappedComponent: any) => {
  class UnconnectedWrapped extends React.Component<Props> {
    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  const Wrapped = connect()(UnconnectedWrapped)

  return Wrapped
}
