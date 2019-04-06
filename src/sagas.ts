import cheerio from 'react-native-cheerio'
import { takeEvery, fork, put } from 'redux-saga/effects'
import { Actions, LoginSuccess, setName } from './redux'
import { Action } from 'redux'
import { AsyncStorage } from 'react-native'
import { AUTH_DATA_PATH } from './constants'

function* handleLoginParsing(action: LoginSuccess) {
  const $ = cheerio.load(action.payload)
  const e = ($('.my-homepage__username').text() || '').trim()

  if (e) {
    yield put(setName(e))
    AsyncStorage.setItem(AUTH_DATA_PATH, JSON.stringify(action.meta))
  } else {
    yield put({
      type: Actions.LOGIN_FAILURE,
    })
  }
}

export function* LoginSaga() {
  yield takeEvery(
    (a: Action) => a.type === Actions.LOGIN_SUCCESS,
    handleLoginParsing,
  )
}

const handleLogout = () => {
  AsyncStorage.removeItem(AUTH_DATA_PATH)
}

export function* LogoutSaga() {
  yield takeEvery((a: Action) => a.type === Actions.LOGOUT, handleLogout)
}

export function* MainSaga() {
  yield fork(LogoutSaga)
  yield fork(LoginSaga)
}
