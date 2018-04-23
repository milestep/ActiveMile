import axios                from 'axios';
import cookie               from 'react-cookie';

const API_URL = `${window.location.origin}/api/v1/holidays`;

const headers = {};
headers['Authorization'] = `Bearer ${cookie.load('token')}`;

export function index() {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      axios.get(API_URL)
        .then(res => {
          dispatch({ type: 'FETCH_HOLIDAY_ITEMS', payload: res.data });
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
          item.id = res.data
          dispatch({ type: 'CREATE_HOLIDAY_ITEM', payload: item });
          resolve(res);
        })
        .catch(e => {
          console.error("error: ", e);
          reject(e);
        })
    })
  }
}

export function update(item, id) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      axios.patch(`${API_URL}/${id}`, item, { headers: headers })
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

export function destroy(id) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      axios.delete(`${API_URL}/${id}`, { headers: headers })
        .then(res => {
          dispatch({ type: 'DESTROY_HOLIDAY_ITEM', payload: id });
          resolve(res);
        })
        .catch(e => {
          console.error("error: ", e);
          reject(e);
        })
    })
  }
}

export function show(id) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_URL}/${id}`, { headers: headers })
        .then(res => {
          dispatch({ type: 'FETCH_HOLIDAY_ITEM', payload: res.data });
          resolve(res);
        })
        .catch(e => {
          console.error("error: ", e);
          reject(e);
        })
    })
  }
}
