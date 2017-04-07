import axios             from 'axios';
import config            from 'app-config';
import { push }          from 'react-router-redux'
import { addAlertAsync } from './alerts';
import LoginActions      from '../constants/auth';
import cookie            from '../utils/cookie';
import ErrorThrower      from '../utils/errorThrower';

const {
  FETCHING_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} = LoginActions;

const apiEndpoint = `${window.location.origin}/api`;
const headers = { 'Content-Type': 'application/json' }; 

function saveAuthToken(token) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  cookie.set({
    name: 'token',
    value: token,
    expires
  });
}

export function login(data, router) {
  return (dispatch) => {
    dispatch({ type: FETCHING_USER, payload: 'signin' });

    const url = `${apiEndpoint}/oauth/token?client_id=${config.clientId}&grant_type=password`;
    const { email, password } = data;
    const body = JSON.stringify(data);

    let errHandler = new ErrorThrower(dispatch, { 
      type: LOGIN_FAILURE
    });

    axios.post(url, body, { headers })
      .then((res) => {
        if (res && res.status == 200) {
          const { access_token } = res.data;
          const { query } = router.location;
          const redirectTo = (query && query.redirectTo) ? query.redirectTo : '/';

          saveAuthToken(access_token);

          dispatch({ type: LOGIN_SUCCESS, payload: {
            token: access_token
          } });

          dispatch(push(redirectTo));

          addAlertAsync({
            message: 'Login successfully'
          })(dispatch);
        }
      }, (err => {
        return errHandler.handleError(err);
      }))
      .catch(err => errHandler.handleUnknownError(err));
  };
}

export function logout(router) {
  return dispatch => {
    cookie.unset('token');
    dispatch({ type: LOGOUT });
    addAlertAsync({
      message: 'Logout successfully'
    })(dispatch);
    dispatch(push('/login'));
  };
}
