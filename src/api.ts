import { Config } from '../config'
import { wait } from './util'
import axios from 'axios'

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
  hasCredentials = false,
}: {
  method: string
  endpoint: string
  body?: object
  headers?: any
  formData?: any
  hasCredentials?: boolean
}) => {
  const config = {
    headers: headers || {
      'Content-Type': 'application/json',
    },
    method,
    url: endpoint.startsWith('https')
      ? endpoint
      : `${Config!.SERVER}${endpoint}`,
    data: JSON.stringify(body),
    withCredentials: hasCredentials ? 'include' : 'omit',
  } as any

  return axios(config)
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
  hasCredentials,
}: {
  type: ApiType
  method: string
  body?: object
  meta?: object
  formData?: any
  headers?: any
  timeout?: number
  endpoint: string
  hasCredentials?: boolean
}) => async (dispatch: any) => {
  if (timeout) {
    await wait(timeout)
  }

  dispatch({ type: type.request, payload: { body, method, endpoint }, meta })

  const json = await makeApiRequest({
    method,
    endpoint,
    body,
    headers,
    formData,
    hasCredentials,
  })

  if (json.status !== 200) {
    const failureAction = { type: type.failure, payload: json, meta }
    if (dispatch) {
      dispatch(failureAction)
    }
    return failureAction
  }

  const successAction = { type: type.success, payload: json.data, meta }
  if (dispatch) {
    dispatch(successAction)
  }
  return successAction
}
