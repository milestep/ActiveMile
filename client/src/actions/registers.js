import axios from 'axios';
import cookie from 'react-cookie';

const API_URL = `${window.location.origin}/api/v1/registers`;
const TOKEN = cookie.load('token')
let HEADERS = new Headers({ 'Content-Type': 'application/json'})
HEADERS['Authorization'] = `Bearer ${TOKEN}`

export function index(current){
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      let headers = Object.assign({}, HEADERS)
      headers['workspace-id'] = getState().workspaces.app.current.id
      headers['year'] = current.year
      headers['month'] = current.month

      axios.get(`${API_URL}`, { headers: headers })
        .then(res => {
          dispatch({ type: 'REGISTER/FETCH', payload: res.data });
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e);
          reject(e)
        })
    })
  }
}

export function show(id){
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      let headers = Object.assign({}, HEADERS)
      headers['workspace-id'] = getState().workspaces.app.current.id

      axios.get(`${API_URL}/${id}`, { headers: headers })
        .then(res => {
          dispatch({ type: 'REGISTER/SHOW', payload: res.data });
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e);
          reject(e)
        })
    })
  }
}

export function create(register){
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      let headers = Object.assign({}, HEADERS)
      headers['workspace-id'] = getState().workspaces.app.current.id
      let body = {register: register}

      axios.post(API_URL, body, { headers: headers })
        .then(res => {
          dispatch({ type: 'REGISTER/CREATE', payload: res.data });
          resolve(res)
        })
        .catch(e => {
          console.error(e);
          reject(e)
        })
    })
  }
}

export function update(register){
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      let headers = Object.assign({}, HEADERS)
      headers['workspace-id'] = getState().workspaces.app.current.id
      let body = {register: register.register}

      axios.patch(`${API_URL}/${register.id}`, body, { headers: headers })
        .then(res => {
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e);
          reject(e)
        })
    })
  }
}

export function destroy(id){
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      let headers = Object.assign({}, HEADERS)
      headers['workspace-id'] = getState().workspaces.app.current.id

      axios.delete(`${API_URL}/${id}`, { headers: headers })
        .then(res => {
          dispatch({ type: 'REGISTER/DELETE', payload: id });
          resolve(res)
        })
        .catch(id => {
          console.error("error", id);
          reject(id)
        })
    })
  }
}
