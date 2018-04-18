import axios from 'axios';
import cookie from 'react-cookie';

const API_URL = `${window.location.origin}/api/v1/registers`;

export function index(params) {
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      let headers = {}
      headers['Authorization'] = `Bearer ${cookie.load('token')}`
      headers['workspace-id'] = getState().workspaces.app.current.id

      axios.get(API_URL, { params, headers })
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
      let headers = {}
      headers['Authorization'] = `Bearer ${cookie.load('token')}`
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
      let headers = {}
      headers['Authorization'] = `Bearer ${cookie.load('token')}`
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
      let headers = {}
      headers['Authorization'] = `Bearer ${cookie.load('token')}`
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
      let headers = {}
      headers['Authorization'] = `Bearer ${cookie.load('token')}`
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

export function fetchRegistersOnScroll(page, params){
  return function(dispatch, getState) {
    return new Promise((resolve, reject) => {
      let headers = {}
      let body = { page: page }
      headers['Authorization'] = `Bearer ${cookie.load('token')}`
      headers['workspace-id'] = cookie.load('current_workspace').id

      axios.post(`${API_URL}/fetch_on_scroll`, body, { params, headers })
        .then(res => {
          if (res.status == 200) dispatch({ type: 'REGISTER/SCROLL', payload: res.data });
          resolve(res)
        })
        .catch(e => {
          console.error("error: ", e);
          reject(e)
        })
    })
  }
}
