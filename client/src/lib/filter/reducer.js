import createReducer       from './utils/createReducer'
import * as constants      from './constants'
import _                   from 'lodash'

const {
  SET_FILTERS, UPDATE_FILTERS,
  DELETE_FILTERS, REMOVE_FILTER
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
      var payload = { name: this.name}

      if (filters) {
        payload['filters'] = filters
      }

      this._dispatch({ type, payload })
    }
  }
}

export function createFilterReducer() {
  return createReducer({}, {
    [SET_FILTERS]: (state, payload) => ({
      ...state,
      [payload.name]: payload.filters
    }),
    [UPDATE_FILTERS]: (state, payload) => {
      var name = payload.name

      return {
        ...state,
        [name]: {
          ...state[name],
          ...payload.filters
        }
      }
    },
    [REMOVE_FILTER]: (state, payload) => {
      var filters = state[payload.name]
      var newFilters = _.clone(filters)

      payload.filters.forEach(name => {
        var filter = newFilters[name]
        if (filter) delete newFilters[name]
      })

      return {
        ...state,
        [payload.name]: newFilters
      }
    },
    [DELETE_FILTERS]: (state, payload) => {
      var newState = _.clone(state)
      delete newState[payload.name]
      return newState
    },
  })
}
