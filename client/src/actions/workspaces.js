import cookie             from 'react-cookie';
import Toaster            from './alerts';
import { defaultHeaders } from 'redux-rest-resource';
import WorkspaceActions   from '../constants/workspaces';

const COOKIE_NAME = 'current_workspace';
const { 
  CURRENT_WORKSPACE_SPECIFIED,
  CURRENT_WORKSPACE_REMOVED
} = WorkspaceActions;

export function getCurrentWorkspace(workspaces = false) {
  return function(dispatch) {
    const currentWorkspace = cookie.load(COOKIE_NAME) || null;

    if (!currentWorkspace) { return null }

    if (workspaces) {
      for (let i in workspaces) {
        if (workspaces[i].id === currentWorkspace.id) {
          return currentWorkspace;
        }
      }
      return null;
    }
    return currentWorkspace;
  }
}

export function specifyCurrentWorkspace(workspace) {
  if (workspace) {
    Object.assign(defaultHeaders, {
      'workspace-id': workspace.id
    });
  }

  return function(dispatch) {
    dispatch({ 
      type: CURRENT_WORKSPACE_SPECIFIED, 
      payload: workspace
    });
  }
}

export function setupCurrentWorkspace(workspace) {
  return function(dispatch) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    cookie.save(COOKIE_NAME, JSON.stringify(workspace), { expires });
    specifyCurrentWorkspace(workspace)(dispatch);
  }
}

export function unsetCurrentWorkspace() {
  return function(dispatch) {
    cookie.remove(COOKIE_NAME);
    dispatch({ type: CURRENT_WORKSPACE_REMOVED });
  }
}
