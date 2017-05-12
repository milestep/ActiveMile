import { defaultHeaders }                 from 'redux-rest-resource';
import { bindActionCreators }             from 'redux';
import cookie                             from 'react-cookie';
import { Toaster }                        from './alerts';
import WorkspaceActions                   from '../constants/workspaces';
import { actions as subscriptionActions } from './subscriptions';

const COOKIE_NAME = 'current_workspace';
const {
  CURRENT_WORKSPACE_SPECIFIED,
  CURRENT_WORKSPACE_REMOVED
} = WorkspaceActions;

export const actions = {
  getCurrentWorkspace: function(workspaces = false) {
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
  },
  specifyCurrentWorkspace: function(workspace) {
    if (workspace) {
      Object.assign(defaultHeaders, {
        'workspace-id': workspace.id
      });
    }

    return function(dispatch, store) {
      const actions = bindActionCreators({
        ...subscriptionActions
      }, dispatch);

      dispatch({ type: CURRENT_WORKSPACE_SPECIFIED,
                 payload: workspace });

      actions.checkSubscribers(true);
    }
  },
  setupCurrentWorkspace: function(workspace) {
    return function(dispatch) {
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      cookie.save(COOKIE_NAME, JSON.stringify(workspace), { expires });
      actions.specifyCurrentWorkspace(workspace)(dispatch);
    }
  },
  unsetCurrentWorkspace: function() {
    return function(dispatch) {
      cookie.remove(COOKIE_NAME);
      dispatch({ type: CURRENT_WORKSPACE_REMOVED });
    }
  }
}
