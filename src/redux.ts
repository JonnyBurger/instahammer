import { Platform } from 'react-native'
import { Constants } from 'expo'
import { createSelector } from 'reselect'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as devTools from 'remote-redux-devtools'
import { Post, AuthenticationStateType } from './types'
import { some, none, Option } from 'fp-ts/lib/Option'
import { POSTS } from './data'
import { callApi } from './api'
import createSagaMiddleware from 'redux-saga'
import { MainSaga } from './sagas'

// Actions

export enum Actions {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGOUT = 'LOGOUT',
  SET_NAME = 'SET_NAME',
  SET_AUTH_CHECKED = 'SET_AUTH_CHECKED',
}

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
type ViewAction = SetName | LoginFailure | SetAuthChecked

// State

type ViewState = {
  authName: Option<string>
  authChecked: boolean
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
}

export const viewReducer = (
  state: ViewState = initialViewState,
  action: ViewAction,
): ViewState => {
  switch (action.type) {
    case Actions.SET_AUTH_CHECKED:
      return {
        ...state,
        authChecked: true,
      }
    case Actions.LOGIN_FAILURE:
      return {
        ...state,
        authChecked: true,
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
  state => state.view,
)

export const selectName = createSelector(
  selectViewState,
  view => view.authName.getOrElse(''),
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
