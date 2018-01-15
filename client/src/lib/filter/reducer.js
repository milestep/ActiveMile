import createReducer       from './utils/createReducer'
import * as constants      from './constants'

const {
  SET_FILTERS, DESTROY_FILTERS,
  ADD_FILTER, ADD_FILTERS,
  REMOVE_FILTER, REMOVE_FILTERS,
} = constants

export class ActionCreator {
  constructor(props) {
    this.name         = props.name
    this._dispatch    = props.dispatch
    this.createAction = this.createAction.bind(this)
  }

  createAction(type) {
    if (typeof type != 'string') return null

    return filters => {
      var payload = {
        name: this.name,
        filters: filters
      }
      this._dispatch({ type, payload })
    }
  }
}

export function createFilterReducer(name) {
  return createReducer({}, {
    [SET_FILTERS]: (state, payload) => {
      return {
        ...state,
        [payload.name]: payload.filters
      }
    }
  })
}
