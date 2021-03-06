import axios                from 'axios'
import cookie               from 'react-cookie'

const API_URL = `${window.location.origin}/api/v1/inventory_items`

let headers = {}
headers['Authorization'] = `Bearer ${cookie.load('token')}`

if (cookie.load('current_workspace')) {
  headers['workspace-id'] = cookie.load('current_workspace').id
}

export function index() {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      headers['workspace-id'] = cookie.load('current_workspace').id
      axios.get(API_URL, { headers })
        .then(res => {
          dispatch({ type: 'FETCH_INVENTORY_ITEMS', payload: res.data })
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e)
          reject(e)
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
          dispatch({ type: 'CREATE_INVENTORY_ITEM', payload: item })
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e)
          reject(e)
        })
    })
  }
}

export function update(item, id) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      axios.patch(`${API_URL}/${id}`, item, { headers: headers })
        .then(res => {
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e)
          reject(e)
        })
    })
  }
}

export function destroy(id) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      axios.delete(`${API_URL}/${id}`, { headers: headers })
        .then(res => {
          dispatch({ type: 'DESTROY_INVENTORY_ITEM', payload: id })
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e)
          reject(e)
        })
    })
  }
}

export function show(id) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      axios.get(`${API_URL}/${id}`, { headers: headers })
        .then(res => {
          dispatch({ type: 'FETCH_INVENTORY_ITEM', payload: res.data })
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e)
          reject(e)
        })
    })
  }
}
