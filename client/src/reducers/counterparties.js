let initState = {
  items: []
}

export default (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_COUNTERPARTIES': {
      return {
        ...state,
        items: action.payload
      }
    }

    default: {
      return state;
    }
  }
}
