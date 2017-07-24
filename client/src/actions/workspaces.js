import { defaultHeaders }                 from 'redux-rest-resource';
import { bindActionCreators }             from 'redux';
import cookie                             from 'react-cookie';
import { Toaster }                        from './alerts';
import { actions as workspaceActions }    from '../resources/workspaces';
import { actions as subscriptionActions } from './subscriptions';
import WorkspaceActions                   from '../constants/workspaces';
import * as utils                         from '../utils';

const COOKIE_NAME = 'current_workspace';
const {
  CURRENT_WORKSPACE_SPECIFIY,
  CURRENT_WORKSPACE_REMOVE,
  CURRENT_WORKSPACE_FETCHING,
  CURRENT_WORKSPACE_RESOLVE,
  CURRENT_WORKSPACE_NEXT
} = WorkspaceActions

export const actions = {
  loadWorkspaces: function() {
    return function(dispatch, getStore) {
      dispatch(actions.moveToPending());

      const store = getStore();
      const prevWorkspace = store.workspaces.app.current;
      const toaster = new Toaster(dispatch);
      const _actions = bindActionCreators({
        ...workspaceActions
      }, dispatch)

      _actions.fetchWorkspaces()
        .then(res => {
          const currentWorkspace = dispatch(actions.getCurrentWorkspace(res.body));
          const firstWorkspace = res.body[0];

          if (!firstWorkspace) {
            dispatch(actions.resolve());
            return;
          };

          if (!currentWorkspace) {
            dispatch(actions.setupCurrentWorkspace(firstWorkspace));
          } else if (!prevWorkspace) {
            dispatch(actions.specifyCurrentWorkspace(currentWorkspace));
          }
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          toaster.error('Could not load workspaces!');
        })
    }
  },
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

    return function(dispatch) {
      const _actions = bindActionCreators({
        ...subscriptionActions
      }, dispatch)

      dispatch({ type: CURRENT_WORKSPACE_SPECIFIY, payload: workspace })

      dispatch(actions.resolve())

      _actions.fetchSubscriptions(true)
        .then(res => dispatch({ type: CURRENT_WORKSPACE_NEXT, payload: workspace }))
        .catch(err => dispatch({ type: CURRENT_WORKSPACE_NEXT, payload: workspace }))
    }
  },
  setupCurrentWorkspace: function(workspace) {
    return function(dispatch) {
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      cookie.save(COOKIE_NAME, JSON.stringify(workspace), { expires });
      dispatch(actions.specifyCurrentWorkspace(workspace));
    }
  },
  unsetCurrentWorkspace: function() {
    return function(dispatch) {
      cookie.remove(COOKIE_NAME);
      dispatch({ type: CURRENT_WORKSPACE_REMOVE });
    }
  },
  moveToPending: function() {
    return function(dispatch) {
      dispatch({ type: CURRENT_WORKSPACE_FETCHING });
    }
  },
  resolve: function() {
    return function(dispatch) {
      dispatch({ type: CURRENT_WORKSPACE_RESOLVE });
    }
  },
  isNextWorkspaceChanged(prevId) {
    return function(dispatch, getStore) {
      const store = getStore()
      const nextId = store.workspaces.app.next.id

      return prevId && nextId && prevId !== nextId
    }
  }
}
