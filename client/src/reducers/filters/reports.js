import FilterActions from '../../constants/filters'

const {
  SET_REPORT_FILTERS
} = FilterActions

const initialState = {
  default: null,
  component: {}
}

export default function reports(state = initialState, action) {
  switch (action.type) {
    case SET_REPORT_FILTERS: {
      return action.payload
    }

    default: {
      return state
    }
  }
  return null
}
