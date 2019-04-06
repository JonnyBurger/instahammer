import * as React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styled from 'styled-components'

import { Post as PostType } from './types'
import { shadow } from './style'
import { format } from 'date-fns'
import { Avatar } from './Avatar'
import { Status } from './Status'

const PostWrapper = styled(TouchableOpacity)`
  border-radius: 8px;
  background-color: white;
  margin: 8px;
`

const PostHeader = styled(View)`
  width: 100%;
  height: 48px;
  padding: 0 8px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-color: #e8e8e8;
`

const PostTitle = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  margin-left: 4px;
`

const PostDescription = styled(Text)`
  width: 100%;
  padding: 16px 16px 0px 16px;
  font-size: 14px;
  height: 84px;
  overflow: hidden;
`

const PostTagsWrapper = styled(View)`
  padding: 8px;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
`

const PostTag = styled(Text)`
  padding: 4px 6px;
  font-weight: bold;
  font-size: 12px;
  background-color: #e8e8e8;
  margin: 2px;
`

const StatusWrapper = styled(View)`
  padding: 2px 4px;
  background-color: #ccffb3;
  margin-left: 8px;
  border-radius: 4px;
`

const StatusText = styled(Text)`
  color: #226600;
  font-size: 11px;
`

const PostFooter = styled(View)`
  width: 100%;
  height: 36px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`

const CreatedAt = styled(Text)`
  font-size: 12px;
  opacity: 0.7;
`

const CommentsLength = styled(Text)`
  font-size: 12px;
  opacity: 0.7;
`

export type Props = {
  post: PostType
  selectPost: (id: string) => void
}

export class Post extends React.Component<Props> {
  render() {
    const { post } = this.props
    return (
      <PostWrapper
        style={shadow}
        onPress={() => this.props.selectPost(post.id)}
      >
        <PostHeader>
          <PostTitle> {post.title}</PostTitle>
          <Status resolved={post.isResolved} />
          <View style={{ flex: 1 }} />
          <Avatar />
        </PostHeader>
        <PostDescription>{post.description}</PostDescription>
        <PostTagsWrapper>
          {post.postTags.map((p, k) => (
            <PostTag key={k}>{p}</PostTag>
          ))}
        </PostTagsWrapper>
        <PostFooter>
          <CreatedAt>
            Created on {format(new Date(post.createdAt * 1000), 'MMMM do')}
          </CreatedAt>
          <CommentsLength>0 Comments</CommentsLength>
        </PostFooter>
      </PostWrapper>
    )
  }
}
