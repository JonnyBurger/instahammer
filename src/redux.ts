import { Platform } from 'react-native'
import { Constants } from 'expo'
import { createSelector } from 'reselect'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as devTools from 'remote-redux-devtools'
import { Post } from './types'
import { some, none, Option } from 'fp-ts/lib/Option'
import { POSTS } from './data'
import { callApi } from './api'
import * as uuid from 'uuid'

// Actions

export enum Actions {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGIN_REQUEST = 'LOGIN_REQUEST',
}

export type LoginRequest = {
  type: Actions.LOGIN_REQUEST
}

export type LoginFailure = {
  type: Actions.LOGIN_FAILURE
  payload: Error
}

export type LoginSuccess = {
  type: Actions.LOGIN_SUCCESS
  payload: {
    data: any
  }
}

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
    body: {
      Username: username,
      Password: password,
      uid: 'f655125b-5455-477c-ad61-dd0f12e4a01c',
    },
    endpoint: 'https://www.sulzer.com/shared/system/login',
  })

type DataAction = any
type ViewAction = any

// State

type ViewState = {}
type DataState = {
  posts: Option<Post[]>
}

export type AppState = {
  view: ViewState
  data: DataState
}

// Reducers

export const initialViewState: ViewState = {}

export const viewReducer = (
  state: ViewState = initialViewState,
  action: ViewAction,
): ViewState => {
  switch (action.type) {
    default:
      return state
  }
}

export const initialDataState: DataState = {
  posts: some(POSTS),
}

export const dataReducer = (
  state: DataState = initialDataState,
  action: DataAction,
): DataState => {
  switch (action.type) {
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
  state => state.data,
)

export const selectPosts = createSelector(
  selectDataState,
  data => data.posts,
)

// Setup

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

  const enhancer = compose(applyMiddleware(thunkMiddleware))

  return createStore(RootReducer, initialState, composeEnhancers(enhancer))
}
