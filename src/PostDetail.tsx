import * as React from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { selectPostDetail, AppState } from './redux'
import { Post as PostType } from './types'
import { Option } from 'fp-ts/lib/Option'
import { headerStyle } from './style'
import { Avatar } from './Avatar'
import { IconButton } from './IconButton'
import { Status } from './Status'

const PostDetailWrapper = styled(View)`
  border-radius: 8px;
  background-color: white;
  margin: 8px;
  padding: 16px;
`

const PostHeader = styled(View)`
  flex-direction: row;
  align-items: center;
`

const PostTitle = styled(Text)`
  font-size: 28px;
  font-weight: bold;
  margin-right: 8px;
`

const PostDescription = styled(Text)`
  font-size: 16px;
  opacity: 0.9;
`

const DataLabel = styled(Text)`
  font-size: 12px;
  opacity: 0.7;
  margin: 24px 0 20px 0;
`

const ReporterName = styled(Text)`
  margin-left: 24px;
  font-weight: bold;
  font-size: 18px;
`

const LoadingWrapper = styled(View)`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ReporterWrapper = styled(View)`
  flex-direction: row;
  align-items: center;
`

const ReputationScore = styled(View)`
  flex-direction: row;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #f0f0f0;
  margin-left: 12px;
`

const StarImage = styled(Image)`
  width: 12px;
  height: 12px;
  opacity: 0.5;
`

const ReputationNumber = styled(Text)`
  margin-left: 4px;
  font-size: 11px;
  font-weight: bold;
  opacity: 0.7;
`
const PostTagsWrapper = styled(View)`
  padding: 8px;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: row;
`

const PostTag = styled(Text)`
  padding: 6px 8px;
  font-weight: bold;
  font-size: 14px;
  background-color: #e8e8e8;
  margin: 2px 2px 2px 0;
`

export type Props = {
  post: Option<PostType>
}

class PostDetail extends React.Component<Props> {
  static navigationOptions = (props: any) => {
    return {
      ...headerStyle,
      title: 'Post Detail',
      headerLeft: (
        <IconButton
          source={require('../assets/chevron.png')}
          onPress={() => props.navigation.goBack()}
          rotate={180}
        />
      ),
      headerRight: (
        <IconButton
          source={require('../assets/chat.png')}
          onPress={() => props.navigation.navigate('Chat')}
          iconStyle={{ width: 28, height: 28 }}
        />
      ),
    }
  }

  render() {
    const { post } = this.props
    return post.fold(
      <LoadingWrapper>
        <ActivityIndicator />
      </LoadingWrapper>,
      detail => (
        <PostDetailWrapper>
          <PostHeader>
            <PostTitle>{detail.title}</PostTitle>
            <Status resolved={detail.resolved} />
          </PostHeader>

          <DataLabel>DESCRIPTION</DataLabel>
          <PostDescription>{detail.description}</PostDescription>
          <DataLabel>REPORTER</DataLabel>
          <ReporterWrapper>
            <Avatar />
            <ReporterName>Jane Smith</ReporterName>
            <ReputationScore>
              <StarImage source={require('../assets/star.png')} />
              <ReputationNumber>505</ReputationNumber>
            </ReputationScore>
          </ReporterWrapper>
          <DataLabel>TAGS</DataLabel>
          <PostTagsWrapper>
            {detail.postTags.map((p, k) => (
              <PostTag key={k}>{p}</PostTag>
            ))}
          </PostTagsWrapper>
        </PostDetailWrapper>
      ),
    )
  }
}

const Connected = connect((state: AppState) => ({
  post: selectPostDetail(state),
}))(PostDetail)

export { Connected as PostDetail }