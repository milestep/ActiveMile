export default function reports(state = {
  items: [],
  item: {}
}, action) {

  switch (action.type) {
    case 'REPORTS/FETCH':
      return {
        ...state,
        items: action.payload.items
      }

      default:
        return state;
  }
}

