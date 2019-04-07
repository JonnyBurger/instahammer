import * as React from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'

import {
  AppState,
  selectPostComments,
  selectName,
  selectPostDetailId,
  addComment,
} from './redux'

import { headerStyle, shadow } from './style'
import { Avatar } from './Avatar'
import { IconButton } from './IconButton'
import { Comment } from './types'
import { format } from 'date-fns'
import { SULZER } from './colors'
import { Option } from 'fp-ts/lib/Option'

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
  min-width: 144px;
`

const CommentMeta = styled(View)`
  flex-direction: row;
  justify-content: ${props => (props.isMe ? 'flex-end' : 'space-between;')};
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
  background-color: ${props => (props.isMe ? SULZER : '#e8e8e8')};
  border-radius: 8px;
  padding: 12px;
`

const CommentText = styled(Text)`
  color: ${props => (props.isMe ? 'white' : 'black')};
`

const AddCommentWrapper = styled(View)`
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
  addComment: any
  selectedPostId: Option<string>
}

class Chat extends React.Component<Props, { show: boolean; text: string }> {
  keyboardDidHideListener: any
  keyboardDidShowListener: any
  keyboardHeight = 0
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

  messageChannel: any
  constructor(props: Props) {
    super(props)
    this.messageChannel = React.createRef()

    this.state = {
      show: false,
      text: '',
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.comments.length !== prevProps.comments.length) {
      setTimeout(() => this.messageChannel.current.scrollToEnd(), 200)
    }
  }

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      e => {
        this.setState({ show: false })
      },
    )
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        if (this.keyboardHeight === 0) {
          this.keyboardHeight = e.endCoordinates.height
        }

        this.setState({ show: true })
      },
    )
  }

  renderComment = (comment: Comment, key: number) => {
    const isMe = comment.author === this.props.name

    return (
      <CommentRow left={!isMe} key={key}>
        <CommentWrapper>
          {!isMe && <Avatar />}
          <CommentContent>
            <CommentTextWrapper isMe={isMe}>
              <CommentText isMe={isMe}>{comment.text}</CommentText>
            </CommentTextWrapper>
            <CommentMeta isMe={isMe}>
              {!isMe && <CommentAuthor>{comment.author}</CommentAuthor>}
              <CommentTime>
                {format(new Date(comment.createdAt * 1000), 'hh:mm' as any)}
              </CommentTime>
            </CommentMeta>
          </CommentContent>
        </CommentWrapper>
      </CommentRow>
    )
  }

  render() {
    const { comments } = this.props
    return (
      <ChatWrapper behavior="height">
        <CommentsWrapper
          ref={this.messageChannel}
          onContentSizeChange={() => {
            this.messageChannel.current.scrollToEnd()
          }}
        >
          {comments.map(this.renderComment)}
          <EmptyRow />
        </CommentsWrapper>
        <AddCommentWrapper
          style={{
            flexBasis: this.state.show ? 348 : 72,
          }}
        >
          <CommentInput
            style={shadow}
            placeholder="Respond here..."
            autoCorrect={false}
            value={this.state.text}
            onChangeText={t => this.setState({ text: t })}
            onSubmitEditing={() => {
              this.props.addComment(
                this.state.text,
                this.props.selectedPostId.getOrElse(''),
                this.props.name,
              )
              this.setState({ text: '' })
            }}
          />
        </AddCommentWrapper>
      </ChatWrapper>
    )
  }
}

const Connected = connect(
  (state: AppState) => ({
    comments: selectPostComments(state),
    name: selectName(state),
    selectedPostId: selectPostDetailId(state),
  }),
  { addComment },
)(Chat)

export { Connected as Chat }
