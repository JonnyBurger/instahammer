import * as React from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { AppState, selectPostComments, selectName } from './redux'

import { headerStyle, shadow } from './style'
import { Avatar } from './Avatar'
import { IconButton } from './IconButton'
import { Comment } from './types'
import { format } from 'date-fns'

const ChatWrapper = styled(KeyboardAvoidingView)`
  border-radius: 8px;
  background-color: white;
  flex: 1;
`

const CommentRow = styled(View)<{ left: boolean }>`
  flex-direction: row;
  justify-content: ${props => (props.left ? 'flex-start' : 'flex-end')};
  width: 100%;
  margin: 8px 0;
`

const CommentsWrapper = styled(ScrollView)`
  flex: 1;
  padding: 8px 8px 64px 8px;
  width: 100%;
`

const CommentWrapper = styled(View)`
  max-width: 256px;
  flex-direction: row;
  align-items: flex-end;
`

const CommentContent = styled(View)`
  margin-left: 8px;
`

const CommentMeta = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 4px;
`

const CommentAuthor = styled(Text)`
  font-size: 11px;
  opacity: 0.7;
`

const CommentTime = styled(Text)`
  font-size: 11px;
  opacity: 0.7;
`

const CommentTextWrapper = styled(View)`
  background-color: #e8e8e8;
  border-radius: 8px;
  padding: 12px;
`

const CommentText = styled(Text)``

const AddCommentWrapper = styled(View)`
  flex-basis: 72;
  flex-shrink: 0;
  width: 100%;
  background-color: #cfd7e2;
  border-top-width: 1px;
  border-color: #afbccf;
  padding: 8px 16px;
`

const EmptyRow = styled(View)`
  width: 100%;
  height: 64px;
`

const CommentInput = styled(TextInput)`
  width: 100%;
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  background-color: white;
`

export type Props = {
  comments: Comment[]
  name: string
}

class Chat extends React.Component<Props> {
  static navigationOptions = (props: any) => {
    return {
      ...headerStyle,
      title: 'Case',
      headerLeft: (
        <IconButton
          source={require('../assets/chevron.png')}
          onPress={() => props.navigation.goBack()}
          rotate={180}
          iconStyle={{ marginLeft: -12 }}
        />
      ),
    }
  }

  renderComment = (comment: Comment, key: number) => (
    <CommentRow left={comment.author !== this.props.name} key={key}>
      <CommentWrapper>
        {comment.author !== this.props.name && <Avatar />}
        <CommentContent>
          <CommentTextWrapper>
            <CommentText>{comment.text}</CommentText>
          </CommentTextWrapper>
          <CommentMeta>
            <CommentAuthor>{comment.author}</CommentAuthor>
            <CommentTime>
              {format(new Date(comment.createdAt * 1000), 'hh:mm' as any)}
            </CommentTime>
          </CommentMeta>
        </CommentContent>
      </CommentWrapper>
    </CommentRow>
  )

  render() {
    const { comments } = this.props
    return (
      <ChatWrapper behavior="height">
        <CommentsWrapper>
          {comments.map(this.renderComment)}
          <EmptyRow />
        </CommentsWrapper>
        <AddCommentWrapper>
          <CommentInput
            style={shadow}
            placeholder="Respond here..."
            autoCorrect={false}
          />
        </AddCommentWrapper>
      </ChatWrapper>
    )
  }
}

const Connected = connect((state: AppState) => ({
  comments: selectPostComments(state),
  name: selectName(state),
}))(Chat)

export { Connected as Chat }
