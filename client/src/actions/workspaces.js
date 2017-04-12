import axios             from 'axios';
import config            from 'app-config';
import { push }          from 'react-router-redux'
import { addAlertAsync } from './alerts';
import WorkspacesActions from '../constants/workspaces';
import cookie            from '../utils/cookie';
import getHeaders        from '../utils/getHeaders';
import ErrorThrower      from '../utils/errorThrower';

const {
  FETCHING_WORKSPACE,
  FETCH_WORKSPACES_FULFILLED,
  FETCH_WORKSPACES_REJECTED,
  CREATE_WORKSPACE_FULFILLED,
  CREATE_WORKSPACE_REJECTED
} = WorkspacesActions;

const apiEndpoint = `${window.location.origin}/api/v1/workspaces`;

export function fetchWorkspaces(router) {
  return (dispatch, getState) => {
    const scope = 'all';
    const { auth: { token } } = getState();

    dispatch({ type: FETCHING_WORKSPACE, payload: scope });

    let workspaces = [];
    let headers = getHeaders(token);
    let errHandler = new ErrorThrower(dispatch, { 
      type: FETCH_WORKSPACES_REJECTED, payload: { scope }
    });

    axios.get(apiEndpoint, { headers })
      .then(res => {
        if (res.status !== 200) { return Promise.reject(); }

        workspaces = res.data;
        dispatch({ type: FETCH_WORKSPACES_FULFILLED, payload: workspaces });

      }, (err => errHandler.handleError(err)))
      .catch(err => errHandler.handleUnknownError(err));
  };
}

export function createWorkspace(workspace) {
  return (dispatch, getState) => {
    const scope = 'create';

    dispatch({ type: FETCHING_WORKSPACE, payload: scope });

    const { auth: { token } } = getState();

    if (!token) { return; }

    let body, headers;
    let { due_date } = workspace;
    let errHandler = new ErrorThrower(dispatch, { 
      type: CREATE_WORKSPACE_REJECTED, payload: { scope }
    });

    body = JSON.stringify({workspace: workspace});
    headers = getHeaders(token);
    headers['Content-Type'] = 'application/json';

    axios.post(apiEndpoint, body, { headers: headers })
      .then(res => {
        if (res.status !== 201) { return Promise.reject(); }
        
        const { data } = res;

        dispatch({type: CREATE_WORKSPACE_FULFILLED, payload: data})
        addAlertAsync({
          message: 'Workspace has been created'
        })(dispatch);

      }, (err => errHandler.handleError(err)))
      .catch(err => errHandler.handleUnknownError(err));
  }
}
