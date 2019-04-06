import React from 'react'
import {
  View,
  Text,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Button,
  TextInput,
} from 'react-native'
import styled from 'styled-components'

import { headerStyle } from './style'
import { IconButton } from './IconButton'
import { SULZER, BACKGROUND } from './colors'
import {
  AppState,
  selectFilteredPosts,
  setSelectedPost,
  setSearchText,
} from './redux'
import { connect } from 'react-redux'
import { Post as PostType } from './types'
import { Option, none } from 'fp-ts/lib/Option'
import { Post } from './Post'
import { debounce } from './util'

const Container = styled(View)`
  flex: 1;
  background-color: ${BACKGROUND};
  width: 100%;
  padding: 8px 0;
`

const PostsWrapper = styled(View)`
  width: 100%;
  padding: 0 16px;
`

const SearchInput = styled(TextInput)`
  width: 100%;
  border-radius: 16px;
  height: 32px;
  background-color: #e8e8e8;
  margin: 8px 0 12px 0;
  font-size: 16px;
  padding: 0 16px;
`

const LoadingWrapper = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`

const SearchWrapper = styled(View)`
  padding: 0 8px;
`

type Props = {
  posts: Option<PostType[]>
  login: (props: { username: string; password: string }) => void
  logout: () => void
  navigation: any
  setSelectedPost: (id: string) => void
  setSearchText: (id: string) => void
}

class Explore extends React.Component<Props> {
  static navigationOptions = (props: any) => {
    return {
      ...headerStyle,
      title: 'Explore',
      headerLeft: (
        <IconButton
          source={require('../assets/hardhat.png')}
          onPress={() => props.navigation.openDrawer()}
          iconStyle={{ width: 28, height: 28 }}
        />
      ),
      headerRight: (
        <IconButton
          source={require('./plus.png')}
          onPress={() => props.navigation.navigate('CameraNavigator')}
        />
      ),
    }
  }

  renderPostItem = (post: PostType) => (
    <Post
      post={post}
      selectPost={(id: string) => {
        this.props.setSelectedPost(id)
        this.props.navigation.navigate('PostDetail')
      }}
    />
  )

  render() {
    const { posts } = this.props
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <SearchWrapper>
          <SearchInput
            placeholder="Search..."
            onChangeText={debounce(this.props.setSearchText, 500)}
          />
        </SearchWrapper>
        <PostsWrapper>
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
        </PostsWrapper>
      </Container>
    )
  }
}

const Connected = connect(
  (state: AppState) => ({
    posts: selectFilteredPosts(state),
  }),
  { setSelectedPost, setSearchText },
)(Explore)

export { Connected as Explore }
