import { combineReducers } from 'redux'
import createReducer       from './utils/createReducer'
import * as constants      from './constants'

const {
  SET_FILTERS,
  SET_DEFAULT_FILTERS,
  SET_COMPONENT_FILTER
} = constants

export class ActionCreator {
  constructor(props) {
    this.reducerName  = props.name
    this._dispatch    = props.dispatch
    this.createAction = this.createAction.bind(this)
  }

  createAction(type) {
    if (typeof type != 'string') return null
    type += this.reducerName
    return payload => {
      this._dispatch({ type, payload })
    }
  }
}

export function createFilterReducer(name) {
  const initialState = { default: null, component: {} }

  return createReducer(initialState, {
    [SET_FILTERS + name]: (state, payload) => (
      _.assign({}, initialState, payload)
    ),
    [SET_DEFAULT_FILTERS + name]: (state, payload) => ({
      ...state,
      default: payload
    }),
    [SET_COMPONENT_FILTER + name]: (state, payload) => ({
      ...state,
      component: payload
    })
  })
}

export function createFilterReducers(reducerNames = []) {
  var reducers = {}

  reducerNames.forEach(name => {
    if (typeof name != 'string') return
    reducers[name] = createFilterReducer(name)
  })

  return combineReducers(reducers)
}
