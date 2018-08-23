import axios from 'axios';
import cookie from 'react-cookie';

const API_URL = `${window.location.origin}/api/v1/reports`;

export function index() {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      let headers = {}
      headers['Authorization'] = `Bearer ${cookie.load('token')}`
      axios.get(API_URL, { headers })
      .then(res => {
        dispatch({type: 'REPORTS/FETCH', payload: { items: res.data }})
        resolve(res)
      })
      .catch(e => {
        console.error("error: ", e);
        reject(e)
      })
    })
  }
}
