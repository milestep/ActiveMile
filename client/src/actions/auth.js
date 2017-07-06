import axios              from 'axios';
import config             from 'app-config';
import cookie             from 'react-cookie';
import * as queryString   from 'query-string';
import { push }           from 'react-router-redux';
import { defaultHeaders } from 'redux-rest-resource';
import { Toaster }        from './alerts';
import LoginActions       from '../constants/auth';
import ErrorThrower       from '../helpers/errorThrower';

const {
  FETCHING_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} = LoginActions;

const apiEndpoint = `${window.location.origin}/api`;
const headers = defaultHeaders;

function saveAuthToken(data) {
  const { access_token } = data;
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  cookie.save('token', access_token, { expires });
  cookie.save('user', JSON.stringify(data), { expires });
  setAuthHeader(data);
}

function resetAuthToken() {
  cookie.remove('token');
  cookie.remove('user');
  resetAuthHeader();
}

export function setAuthHeader(data) {
  const { access_token, token_type } = data;

  if (!defaultHeaders['Authorization']) {
    Object.assign(defaultHeaders, {
      Authorization: `${token_type} ${access_token}`
    });
  }
}

export function resetAuthHeader() {
  delete defaultHeaders.Authorization;
}

export function login(data, router) {
  return (dispatch) => {
    dispatch({ type: FETCHING_USER, payload: 'signin' });

    const stringifiedParams = queryString.stringify({
      'client_id': config.clientId,
      'grant_type': 'password'
    });
    const url = `${apiEndpoint}/oauth/token?${stringifiedParams}`;
    const { email, password } = data;
    const body = JSON.stringify(data);
    const errHandler = new ErrorThrower(dispatch, {
      type: LOGIN_FAILURE
    });

    axios.post(url, body, { headers })
      .then((res) => {
        if (res && res.status == 200) {
          const { query } = router.location;
          const redirectTo = (query && query.redirectTo) ? query.redirectTo : '/';
          const { data } = res;

          dispatch({
            type: LOGIN_SUCCESS,
            payload: {
              token: data.access_token
            }
          });

          saveAuthToken(data);
          dispatch(push(redirectTo));
          new Toaster(dispatch).success('Login successfully');
        }
      })
      .catch(err => {
        errHandler.handleError(err);
      });
  };
}

export function logout(router) {
  return dispatch => {
    resetAuthToken();
    dispatch({ type: LOGOUT });
    new Toaster(dispatch).success('Logout successfully');
    dispatch(push('/login'));
  };
}
