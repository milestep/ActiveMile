export default function registers(state = {
    items: [],
    item: {},
    years: [],
    isCreating: false,
    isUpdating: false
  }, action) {

  switch (action.type) {
    case "REGISTER/FETCH":
      return {
        ...state,
        items: action.payload.items,
        years: action.payload.years
      }

    case "REGISTER/SHOW":
      return {
        ...state,
        item: action.payload
      }

    case "REGISTER/CREATE":
      return {
        ...state,
        items: [ action.payload, ...state.items ]
      }

    case "REGISTER/DELETE":
      state.items = state.items.filter(t => t.id !== action.payload);
      return {
        ...state,
        items: [ ...state.items ]
      }

    case "REGISTER/IS_CREATING":
      return {
        ...state,
        isCreating: action.payload
      }

    case "REGISTER/IS_UPDATING":
      return {
        ...state,
        isUpdating: action.payload
      }

    default:
      return state;
  }
}