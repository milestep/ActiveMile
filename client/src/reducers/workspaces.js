import WorkspacesActions from '../constants/workspaces';

const {
  FETCHING_WORKSPACE,
  FETCH_WORKSPACES_FULFILLED,
  FETCH_WORKSPACES_REJECTED,
  CREATE_WORKSPACE_FULFILLED,
  CREATE_WORKSPACE_REJECTED
} = WorkspacesActions;

const initialState = {
  single: {},
  all: [],
  fetching: {
    all: false,
    create: false,
    destroy: false
  },
  fetched: {
    all: false,
    create: false,
    destroy: false
  },
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_WORKSPACE: {
      const { payload } = action;

      return {
        ...state,
        fetching: {
          ...state.fetching,
          [payload]: true
        },
        fetched: {
          ...state.fetched,
          [payload]: false
        },
        error: null,
      };
    }

    case FETCH_WORKSPACES_FULFILLED: {
      return {
        ...state,
        all: action.payload,
        fetching: {
          ...state.fetching,
          all: false
        },
        fetched: {
          ...state.fetched,
          all: true
        },
        error: null
      };
    }

    case CREATE_WORKSPACE_FULFILLED: {
      return {
        ...state,
        all: [ action.payload, ...state.all ],
        fetching: {
          ...state.fetching,
          create: false
        },
        fetched: {
          ...state.fetched,
          create: true
        },
        error: null
      };
    }

    case FETCH_WORKSPACES_REJECTED:
    case CREATE_WORKSPACE_REJECTED: {
      const { scope, error } = action.payload;

      return {
        ...state,
        fetching: {
          ...state.fetching,
          [scope]: false
        },
        fetched: {
          ...state.fetched,
          [scope]: true
        },
        error,
      };
    }

    default: {
      return state;
    }
  }
}
