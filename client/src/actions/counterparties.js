import axios                from 'axios'
import cookie               from 'react-cookie'

const API_URL = `${window.location.origin}/api/v1/counterparties`

const headers = {};
headers['Authorization'] = `Bearer ${cookie.load('token')}`
headers['workspace-id'] = cookie.load('current_workspace').id

export function index() {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      axios.get(API_URL, { headers })
        .then(res => {
          dispatch({ type: 'FETCH_COUNTERPARTIES', payload: res.data })
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e)
          reject(e)
        })
    })
  }
}
