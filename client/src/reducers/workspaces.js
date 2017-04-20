import WorkspaceActions from '../constants/workspaces';

const initialState = {
  currentWorkspace: null
};
const { 
  CURRENT_WORKSPACE_SPECIFIED,
  CURRENT_WORKSPACE_REMOVED
} = WorkspaceActions;

export default (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_WORKSPACE_SPECIFIED: {
      return {
        ...state,
        currentWorkspace: action.payload
      }
    }

    case CURRENT_WORKSPACE_REMOVED: {
      return {
        ...state,
        currentWorkspace: null
      }
    }

    default: {
      return state;
    }
  }
}
