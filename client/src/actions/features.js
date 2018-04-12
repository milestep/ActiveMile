import axios                from 'axios'
import cookie               from 'react-cookie'

const API_URL = `${window.location.origin}/api/v1/features`

let headers = {}
headers['Authorization'] = `Bearer ${cookie.load('token')}`

export function show() {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      let currentWorkspace = cookie.load('current_workspace')
      let { id } = currentWorkspace

      headers['workspace-id'] = id

      axios.get(`${API_URL}/${id}`, { headers })
        .then(res => {
          dispatch({ type: 'FETCH_CURRENT_FEATURES', payload: res.data.sales })
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e)
          reject(e)
        })
    })
  }
}
