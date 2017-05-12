import WorkspaceActions from '../constants/workspaces';

const { 
  CURRENT_WORKSPACE_SPECIFIED,
  CURRENT_WORKSPACE_REMOVED
} = WorkspaceActions;

const initialState = {
  current: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_WORKSPACE_SPECIFIED: {
      return {
        ...state,
        current: action.payload
      }
    }

    case CURRENT_WORKSPACE_REMOVED: {
      return {
        ...state,
        current: null
      }
    }

    default: {
      return state;
    }
  }
}
