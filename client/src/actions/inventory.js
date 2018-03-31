import axios                from 'axios';
import cookie               from 'react-cookie';

const API_URL = `${window.location.origin}/api/v1/inventory_items`;

const headers = {};
headers['Authorization'] = `Bearer ${cookie.load('token')}`;

export function index() {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      axios.get(API_URL, { headers })
        .then(res => {
          dispatch({ type: 'FETCH_INVENTORY_ITEMS', payload: res.data });
          resolve(res);
        })
        .catch(e => {
          console.error("error: ", e);
          reject(e);
        })
    })
  }
}

export function create(item) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      axios.post(API_URL, item, { headers })
        .then(res => {
          resolve(res);
        })
        .catch(e => {
          console.error("error: ", e);
          reject(e);
        })
    })
  }
}

export function update() {
  return function(dispatch, getState) {
    // return new Promise((resolve, reject) => {
      // axios.patch(`${API_URL}/${register.id}`, body, { headers: headers })
    //     .then(res => {
    //       resolve(res);
    //     })
    //     .catch(e => {
    //       console.error("error: ", e);
    //       reject(e);
    //     })
    // })
  }
}

export function destroy() {
  return function(dispatch, getState) {
    // return new Promise((resolve, reject) => {
      // axios.delete(`${API_URL}/${id}`, { headers: headers })
    //     .then(res => {
    //       resolve(res);
    //     })
    //     .catch(e => {
    //       console.error("error: ", e);
    //       reject(e);
    //     })
    // })
  }
}
