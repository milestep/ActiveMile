let initState = {
  items: []
}

export default (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_INVENTORY_ITEMS': {
      return {
        items: action.payload
      }
    }

    default: {
      return state;
    }
  }
}
