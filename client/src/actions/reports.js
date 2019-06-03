import axios from 'axios';
import cookie from 'react-cookie';

const API_URL = `${window.location.origin}/api/v1/reports`;

export function index(params, page) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      let headers = {}
      headers['Authorization'] = `Bearer ${cookie.load('token')}`
      headers['workspace-id'] = getState().workspaces.app.current.id
      params.page = page

      axios.get(API_URL, { params, headers })
        .then(res => {
          dispatch({ type: (page == 0 || !page)? 'REGISTER/FETCH' : 'REGISTER/SCROLL', payload: res.data })                
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e);
          reject(e)
        }
      )
    })
  }
}