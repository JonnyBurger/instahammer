import { Platform } from 'react-native'
import { Constants } from 'expo'
import { createSelector } from 'reselect'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as devTools from 'remote-redux-devtools'
import { Post, AuthenticationStateType, Comment } from './types'
import { some, none, Option, option } from 'fp-ts/lib/Option'
import { callApi } from './api'
import createSagaMiddleware from 'redux-saga'
import { MainSaga } from './sagas'
import { liftA2 } from 'fp-ts/lib/Apply'
import { findFirst, sort } from 'fp-ts/lib/Array'
import { Ord } from 'fp-ts/lib/Ord'

// Actions

export enum Actions {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  FETCH_POSTS_REQUEST = 'FETCH_POSTS_REQUEST',
  FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE',
  FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS',
  POST_ADDED = 'POST_ADDED',
  LOGOUT = 'LOGOUT',
  SET_NAME = 'SET_NAME',
  SET_AUTH_CHECKED = 'SET_AUTH_CHECKED',
  SET_SELECTED_POST = 'SET_SELECTED_POST',
  SET_SEARCH_TEXT = 'SET_SEARCH_TEXT',
  ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST',
  ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS',
  ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE',
}

type SetSearchText = {
  type: Actions.SET_SEARCH_TEXT
  payload: string
}

export const setSearchText = (text: string): SetSearchText => ({
  type: Actions.SET_SEARCH_TEXT,
  payload: text,
})

type SetSelectedPost = {
  type: Actions.SET_SELECTED_POST
  payload: string
}

export const setSelectedPost = (id: string): SetSelectedPost => ({
  type: Actions.SET_SELECTED_POST,
  payload: id,
})

type SetName = {
  type: Actions.SET_NAME
  payload: string
}

export const setName = (name: string): SetName => ({
  type: Actions.SET_NAME,
  payload: name,
})

type SetAuthChecked = {
  type: Actions.SET_AUTH_CHECKED
}

export const setAuthChecked = (): SetAuthChecked => ({
  type: Actions.SET_AUTH_CHECKED,
})

type Logout = {
  type: Actions.LOGOUT
}

export const logout = (): Logout => ({
  type: Actions.LOGOUT,
})

export type LoginRequest = {
  type: Actions.LOGIN_REQUEST
}

export type LoginFailure = {
  type: Actions.LOGIN_FAILURE
}

export type LoginSuccess = {
  type: Actions.LOGIN_SUCCESS
  payload: {
    data: string
  }
  meta: {
    username: string
    password: string
  }
}

export type FetchPostsSuccess = {
  type: Actions.FETCH_POSTS_SUCCESS
  payload: Post[]
}

export type PostAdded = {
  type: Actions.POST_ADDED
  payload: Post
}

export type AddCommentSuccess = {
  type: Actions.ADD_COMMENT_SUCCESS
  meta: {
    text: string
    postId: string
    author: string
  }
}

export const addComment = (text: string, postId: string, author: string) =>
  callApi({
    type: {
      request: Actions.ADD_COMMENT_REQUEST,
      success: Actions.ADD_COMMENT_SUCCESS,
      failure: Actions.ADD_COMMENT_FAILURE,
    },
    method: 'POST',
    body: {
      text,
      postId,
      author,
    },
    meta: {
      text,
      postId,
      author,
    },
    endpoint: '/v1/comments',
  })

export const fetchPosts = () =>
  callApi({
    type: {
      request: Actions.FETCH_POSTS_REQUEST,
      success: Actions.FETCH_POSTS_SUCCESS,
      failure: Actions.FETCH_POSTS_FAILURE,
    },
    method: 'GET',
    endpoint: '/v1/posts',
  })

export const login = ({
  username,
  password,
}: {
  username: string
  password: string
}) =>
  callApi({
    type: {
      request: Actions.LOGIN_REQUEST,
      success: Actions.LOGIN_SUCCESS,
      failure: Actions.LOGIN_FAILURE,
    },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    meta: {
      username,
      password,
    },
    hasCredentials: true,
    body: {
      Username: username,
      Password: password,
      uid: 'f655125b-5455-477c-ad61-dd0f12e4a01c',
    },
    endpoint: 'https://www.sulzer.com/shared/system/login',
  })

type DataAction = any
type ViewAction =
  | SetName
  | LoginFailure
  | SetAuthChecked
  | Logout
  | LoginSuccess
  | SetSelectedPost
  | LoginRequest
  | SetSearchText

// State

type ViewState = {
  authName: Option<string>
  authChecked: boolean
  isLoggingIn: boolean
  selectedPostId: Option<string>
  searchText: string
}

type DataState = {
  posts: Option<Post[]>
}

export type AppState = {
  view: ViewState
  data: DataState
}

// Reducers

export const initialViewState: ViewState = {
  authName: none,
  authChecked: false,
  isLoggingIn: false,
  selectedPostId: none,
  searchText: '',
}

export const viewReducer = (
  state: ViewState = initialViewState,
  action: ViewAction,
): ViewState => {
  switch (action.type) {
    case Actions.SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.payload,
      }
    case Actions.SET_SELECTED_POST:
      return {
        ...state,
        selectedPostId: some(action.payload),
      }
    case Actions.LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
      }
    case Actions.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
      }
    case Actions.LOGOUT:
      return {
        ...state,
        authName: none,
      }
    case Actions.SET_AUTH_CHECKED:
      return {
        ...state,
        authChecked: true,
      }
    case Actions.LOGIN_FAILURE:
      return {
        ...state,
        authChecked: true,
        isLoggingIn: false,
      }
    case Actions.SET_NAME:
      return {
        ...state,
        authName: some(action.payload),
        authChecked: true,
      }
    default:
      return state
  }
}

export const initialDataState: DataState = {
  posts: none,
}

export const dataReducer = (
  state: DataState = initialDataState,
  action: DataAction,
): DataState => {
  switch (action.type) {
    case Actions.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        posts: state.posts.map(posts =>
          posts.map(post => {
            if (post.id === action.meta.postId) {
              return {
                ...post,
                comments: [
                  {
                    ...action.meta,
                    createdAt: new Date().getTime(),
                    id: 'new',
                  },
                  ...post.comments,
                ],
              }
            }
            return post
          }),
        ),
      }
    case Actions.FETCH_POSTS_SUCCESS:
      return {
        ...state,
        posts: some(action.payload),
      }
    case Actions.POST_ADDED:
      return {
        ...state,
        posts: state.posts.fold(some([action.post]), posts =>
          some([...posts, action.post]),
        ),
      }
    default:
      return state
  }
}

export const RootReducer = combineReducers({
  view: viewReducer,
  data: dataReducer,
})

// Selectors

const selectDataState = createSelector(
  (state: AppState) => state,
  state => state.data,
)

const selectViewState = createSelector(
  (state: AppState) => state,
  state => state.view,
)

export const selectName = createSelector(
  selectViewState,
  view => view.authName.getOrElse(''),
)

export const selectSearchText = createSelector(
  selectViewState,
  view => view.searchText,
)

export const selectPostDetailId = createSelector(
  selectViewState,
  view => view.selectedPostId,
)

export const selectIsLogginIn = createSelector(
  selectViewState,
  view => view.isLoggingIn,
)

export const selectAuthenticationState = createSelector(
  selectViewState,
  view => {
    if (view.authName.isSome()) {
      return AuthenticationStateType.Authenticated
    } else if (!view.authChecked) {
      return AuthenticationStateType.Initializing
    } else {
      return AuthenticationStateType.Unauthenticated
    }
  },
)

export const selectPosts = createSelector(
  selectDataState,
  data => data.posts,
)

const postSetoid: Ord<Post> = {
  compare: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
  equals: (a, b) => a.createdAt < b.createdAt,
}

export const selectFilteredPosts = createSelector(
  selectPosts,
  selectSearchText,
  (postsOption, searchText) =>
    searchText === ''
      ? postsOption
      : postsOption.map(posts =>
          sort<Post>(postSetoid)(
            posts.filter(
              p =>
                p.title
                  .toLocaleLowerCase()
                  .indexOf(searchText.toLocaleLowerCase()) !== -1,
            ),
          ),
        ),
)

export const selectPostDetail = createSelector(
  selectPostDetailId,
  selectPosts,
  (postIdOption, postsOption) =>
    liftA2(option)((postId: string) => (posts: Post[]) =>
      findFirst(posts, p => p.id === postId),
    )(postIdOption)(postsOption).chain(v => v),
)

const commentSetoid: Ord<Comment> = {
  compare: (a, b) => (a.createdAt > b.createdAt ? 1 : -1),
  equals: (a, b) => a.createdAt > b.createdAt,
}

export const selectPostComments = createSelector(
  selectPostDetail,
  detailOption =>
    detailOption.fold([], detail =>
      sort<Comment>(commentSetoid)(detail.comments),
    ),
)

// Setup
const sagaMiddleware = createSagaMiddleware()

export const configureStore = (initialState = {}) => {
  const composeEnhancers = devTools.composeWithDevTools({
    name: Platform.OS,
    hostname: `${
      Constants.manifest &&
      Constants.manifest.hostUri &&
      Constants.manifest.hostUri.match(/([0-9.]+):/)
        ? Constants.manifest.hostUri.match(/([0-9.]+):/)[1]
        : 'localhost'
    }:5678`,
  })

  const enhancer = compose(applyMiddleware(thunkMiddleware, sagaMiddleware))

  return createStore(RootReducer, initialState, composeEnhancers(enhancer))
}

export const store = configureStore()

sagaMiddleware.run(MainSaga)
