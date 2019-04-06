import React from 'react'
import {
  View,
  Text,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Button,
} from 'react-native'
import styled from 'styled-components'

import { headerStyle } from './style'
import { IconButton } from './IconButton'
import { SULZER, BACKGROUND } from './colors'
import { AppState, selectPosts, login } from './redux'
import { connect } from 'react-redux'
import { Post } from './types'
import { Option, none } from 'fp-ts/lib/Option'

const Container = styled(View)`
  flex: 1;
  background-color: ${BACKGROUND};
  width: 100%;
`

const LoadingWrapper = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const PostItem = styled(View)`
  margin: 16px 0;
`

const PostTitle = styled(Text)`
  font-size: 18px;
`

type Props = {
  posts: Option<Post[]>
  login: (props: { username: string; password: string }) => void
}

class Explore extends React.Component<Props> {
  static navigationOptions = (props: any) => {
    return {
      ...headerStyle,
      title: 'Explore',
      headerRight: (
        <IconButton source={require('./plus.png')} onPress={() => {}} />
      ),
    }
  }

  renderPostItem = (post: Post) => (
    <PostItem key={post.id}>
      <PostTitle>{post.title}</PostTitle>
    </PostItem>
  )

  render() {
    const { posts } = this.props
    return (
      <Container>
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
        {posts.fold(
          <LoadingWrapper>
            <ActivityIndicator size="large" />
          </LoadingWrapper>,
          p => (
            <FlatList
              data={p}
              keyExtractor={(item, index) => String(index)}
              renderItem={({ item }) => this.renderPostItem(item)}
            />
          ),
        )}
      </Container>
    )
  }
}

const Connected = connect(
  (state: AppState) => ({
    posts: selectPosts(state),
  }),
  { login },
)(Explore)

export { Connected as Explore }
