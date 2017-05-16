import WorkspaceActions from '../constants/workspaces';

const {
  CURRENT_WORKSPACE_SPECIFIED,
  CURRENT_WORKSPACE_REMOVED,
  CURRENT_WORKSPACE_FETCHING
} = WorkspaceActions;

const initialState = {
  current: null,
  fetching: false,
  resolved: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_WORKSPACE_SPECIFIED: {
      return {
        ...state,
        current: action.payload,
        fetching: false,
        resolved: true
      }
    }

    case CURRENT_WORKSPACE_REMOVED: {
      return {
        ...state,
        current: null
      }
    }

    case CURRENT_WORKSPACE_FETCHING: {
      return {
        ...state,
        fetching: true,
        resolved: false
      }
    }

    default: {
      return state;
    }
  }
}
