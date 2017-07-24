import WorkspaceActions from '../constants/workspaces';

const {
  CURRENT_WORKSPACE_SPECIFIY,
  CURRENT_WORKSPACE_REMOVE,
  CURRENT_WORKSPACE_FETCHING,
  CURRENT_WORKSPACE_RESOLVE,
  CURRENT_WORKSPACE_NEXT
} = WorkspaceActions;

const initialState = {
  next: {},
  current: null,
  fetching: false,
  resolved: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_WORKSPACE_SPECIFIY: {
      return {
        ...state,
        current: action.payload
      }
    }

    case CURRENT_WORKSPACE_REMOVE: {
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

    case CURRENT_WORKSPACE_RESOLVE: {
      return {
        ...state,
        fetching: false,
        resolved: true
      }
    }

    case CURRENT_WORKSPACE_NEXT: {
      return {
        ...state,
        next: action.payload
      }
    }

    default: {
      return state;
    }
  }
}
