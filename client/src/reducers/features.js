export default (state = null, action) => {
  switch (action.type) {
    case 'FETCH_CURRENT_FEATURES': {
      return {
        ...state,
        sales: action.payload
      }
    }

    case 'UPDATE_WORKSPACE_SETTINGS': {
      return {
        ...state,
        sales: action.payload
      }
    }

    default: {
      return state;
    }
  }
}
