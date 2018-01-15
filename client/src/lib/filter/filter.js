import _                 from 'lodash'
import { ActionCreator } from './reducer'
import * as constants    from './constants'

const { SET_FILTERS } = constants

export class Filter {
  constructor(props) {
    this.name    = props.name
    this.action  = props.action
    this.actions = {}

    this.createActions()
    this.setFilters(props.filters)
  }

  createActions() {
    var { createAction } = new ActionCreator({
      name: this.name,
      dispatch: this.action.dispatch
    })

    this.actions = {
      setFilters: createAction(SET_FILTERS)
    }
  }

  setFilters(filters) {
    var handledFilters = this.handleFilters(filters)
    this.actions.setFilters(handledFilters)
  }

  checkFilters(filters) {
    var res = this.verifyFilters(filters)
    if (!res.isValid) throw new Error(res.error)
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
