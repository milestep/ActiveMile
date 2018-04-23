let initState = {
  item: {},
  items: []
}

export default (state = initState, action) => {
  switch (action.type) {
    case 'CREATE_HOLIDAY_ITEM': {
      return {
        ...state,
        items: [ action.payload, ...state.items ]
      }
    }

    case 'FETCH_HOLIDAY_ITEMS': {
      return {
        ...state,
        items: action.payload
      }
    }

    case 'FETCH_HOLIDAY_ITEM': {
      return {
        ...state,
        item: action.payload
      }
    }

    case 'DESTROY_HOLIDAY_ITEM': {
      return {
        ...state,
        items: state.items.filter(el => el.id !== action.payload)
      }
    }

    default: {
      return state;
    }
  }
}
