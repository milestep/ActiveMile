import AuthActions from '../constants/auth';
import cookie      from 'react-cookie';

const {
  FETCHING_USER,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} = AuthActions;

const initialState = {
  token: cookie.load('token') || null,
  fetching: {
    signin: false
  },
  fetched: {
    signin: true
  },
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCHING_USER: {
      const field = action.payload;

      return {
        ...state,
        fetching: {
          ...state.fetching,
          [field]: true
        },
        fetched: {
          ...state.fetched,
          [field]: false
        },
        error: null,
      };
    }

    case LOGIN_SUCCESS: {
      const { token } = action.payload;

      return {
        ...state,
        token: token,
        fetching: {
          ...state.fetching,
          signin: false
        },
        fetched: {
          ...state.fetched,
          signin: true
        },
        error: null,
      };
    } 

    case LOGIN_FAILURE: {
      const { error } = action.payload;

      return {
        ...state,
        fetching: {
          ...state.fetching,
          signin: false
        },
        fetched: {
          ...state.fetched,
          signin: true
        },
        error
      };
    }

    case LOGOUT: {
      return cookie.load('token') ? { ...initialState } : { ...state, token: null }
    }

    default: {
      return state;
    }
  }
}
