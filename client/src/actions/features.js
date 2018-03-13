// import axios from 'axios';
// import cookie from 'react-cookie';

// const API_URL = `${window.location.origin}/api/v1/registers`;

export function fetchFeatures() {
  return function(dispatch, getState) {
    console.log('1111111111');
    console.log('1111111111');
    console.log('1111111111');
    console.log('1111111111');
    console.log('1111111111');
    // return new Promise((resolve, reject) => {
    //   let headers = {}
    //   headers['Authorization'] = `Bearer ${cookie.load('token')}`
    //   headers['workspace-id'] = getState().workspaces.app.current.id

    //   axios.get(API_URL, { params, headers })
    //     .then(res => {
    //       dispatch({ type: 'REGISTER/FETCH', payload: res.data });
    //       resolve(res)
    //     })
    //     .catch(e => {
    //       console.error("error: ", e);
    //       reject(e)
    //     })
    // })
  }
}

// export function update(){
    // console.log('**********')
  // return function(dispatch, getState) {
    // return new Promise((resolve, reject) => {
    //   let headers = {}
    //   headers['Authorization'] = `Bearer ${cookie.load('token')}`
    //   headers['workspace-id'] = getState().workspaces.app.current.id
    //   let body = {register: register.register}

    //   axios.patch(`${API_URL}/${register.id}`, body, { headers: headers })
    //     .then(res => {
    //       resolve(res)
    //     })
    //     .catch(e => {
    //       console.error("error: ", e);
    //       reject(e)
    //     })
    // })
  // }
// }