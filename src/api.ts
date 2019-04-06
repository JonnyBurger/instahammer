import { Config } from '../config'
import { wait } from './util'

export const apiTypeBuilder = (type: string) => ({
  request: `${type}/REQUEST`,
  success: `${type}/SUCCESS`,
  failure: `${type}/FAILURE`,
})

const makeApiRequest = async ({
  method,
  endpoint,
  body,
  headers,
  formData,
}: {
  method: string
  endpoint: string
  body?: object
  headers?: any
  formData?: any
}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  let options: RequestInit = {
    method,
    headers: headers || defaultHeaders,
  }

  if (body !== undefined) {
    options = {
      ...options,
      body: JSON.stringify(body),
    }
  } else if (formData !== undefined) {
    options = {
      ...options,
      body: formData,
    }
  }
  if (endpoint.startsWith('https')) {
    console.log(options)
    return fetch(endpoint, options)
  }
  return fetch(`${Config!.SERVER}/api${endpoint}`, options)
}

const tryGetJson = async (resp: any) => {
  return new Promise(resolve => {
    if (resp) {
      resp
        .json()
        .then((json: object) => resolve(json))
        .catch(() => resolve())
    } else {
      resolve()
    }
  })
}

type ApiType = {
  request: string
  success: string
  failure: string
}

export const callApi = ({
  type,
  method,
  body,
  meta,
  endpoint,
  formData,
  headers,
  timeout,
}: {
  type: ApiType
  method: string
  body?: object
  meta?: object
  formData?: any
  headers?: any
  timeout?: number
  endpoint: string
}) => async (dispatch: any) => {
  if (timeout) {
    await wait(timeout)
  }

  dispatch({ type: type.request, payload: { body, method, endpoint }, meta })

  const res = await makeApiRequest({
    method,
    endpoint,
    body,
    headers,
    formData,
  })
  const json = await tryGetJson(res)
  if (res.status !== 200) {
    const failureAction = { type: type.failure, payload: json, meta }
    if (dispatch) {
      dispatch(failureAction)
    }
    return failureAction
  }

  const successAction = { type: type.success, payload: json, meta, raw: res }
  if (dispatch) {
    dispatch(successAction)
  }
  return successAction
}
