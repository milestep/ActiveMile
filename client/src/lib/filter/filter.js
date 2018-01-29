import _                 from 'lodash'
import { ActionCreator } from './action'
import * as constants    from './constants'

const {
  SET_FILTERS, UPDATE_FILTERS,
  DELETE_FILTERS, REMOVE_FILTER
} = constants

export class Filter {
  constructor(props) {
    this.props  = props
    this.action = props.action

    this.createActions()
    this.setFilters(props.filters)
  }

  createActions() {
    var { createActions } = new ActionCreator({
      name: this.props.name,
      dispatch: this.action.dispatch
    })

    this.actions = createActions({
      setFilters: SET_FILTERS,
      updateFilters: UPDATE_FILTERS,
      removeFilter: REMOVE_FILTER,
      deleteFilters: DELETE_FILTERS
    }, {
      afterAction: [ this.updateStore.bind(this) ]
    })
  }

  setFilters(filters) {
    var handledFilters = this.handleFilters(filters)
    this.actions.setFilters(handledFilters)
  }

  updateFilters(filters) {
    var handleFilters = this.handleFilters(filters)
    this.actions.updateFilters(handleFilters)
  }

  removeFilter() {
    var names = arguments[0]
    var errmsg = 'Filter names must be a string or an array of strings'

    if (_.isString(names)) {
      names = [names]
    } else if (!_.isArray(names)) {
      this._throw(errmsg)
    }

    names.forEach(name => {
      if (!_.isString(name)) this._throw(errmsg)
    })

    this.actions.removeFilter(names)
  }

  deleteFilters() {
    this.actions.deleteFilters()
  }

  getFilters() {
    var store = this.getStore()
    return store.filters[this.props.name]
  }

  getStore() {
    return this.store
  }

  updateStore() {
    this.store = this.action.getState()
  }

  handleFilters(filters) {
    var handledFilters = {}

    if (!filters || !filters.constructor == Object) {
      this._throw('Component filters must be an object')
    }

    for (var name in filters) {
      var filter = filters[name]
      if (!_.isArray(filter)) {
        this._throw('Filter must be an array')
      }

      if (!filter.length) {
        this._throw('Filter must contain at least one filter item')
      }

      handledFilters[name] = filter.map(item => (this.handleFilterItem(item)))
    }

    return handledFilters
  }

  handleFilterItem(item) {
    if (!item || !item['value']) {
      this._throw("Filter item must contain a 'value' attribute")
    }

    var { value, name, applied } = item

    return {
      value,
      name: name || value,
      applied: applied || false
    }
  }

  _throw(message) {
    throw new Error(message)
  }
}
