import WorkspaceActions from '../constants/workspaces';

const initialState = {
  currentWorkspace: null
};
const { 
  CURRENT_WORKSPACE_SPECIFIED 
} = WorkspaceActions;

export default (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_WORKSPACE_SPECIFIED: {
      return {
        ...state,
        currentWorkspace: action.payload
      }
    }

    default: {
      return state;
    }
  }
}
