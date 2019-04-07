import * as React from 'react'
import { connect } from 'react-redux'
import { fetchPosts, AppState, selectPosts } from './redux'
import { Post } from './types'
import { Option } from 'fp-ts/lib/Option'
import { AppLoading } from 'expo'

type Props = {
  fetchPosts: () => void
  posts: Option<Post[]>
}

export const DataAsync = (WrappedComponent: any) => {
  class UnconnectedWrapped extends React.Component<Props> {
    componentWillMount() {
      this.props.fetchPosts()
      setInterval(this.props.fetchPosts, 5000)
    }

    render() {
      if (this.props.posts.isNone()) {
        return <AppLoading />
      }
      return <WrappedComponent {...this.props} />
    }
  }

  const Wrapped = connect(
    (state: AppState) => ({
      posts: selectPosts(state),
    }),
    { fetchPosts },
  )(UnconnectedWrapped)

  return Wrapped
}
