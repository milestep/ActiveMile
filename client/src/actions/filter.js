import FilterActions  from '../constants/filters'
import MonthsStrategy from './filter/strategies/months'
import YearsStrategy  from './filter/strategies/years'
import _              from 'lodash'

const {
  SET_REPORT_FILTERS
} = FilterActions

const STRATEGIES = {
  years: YearsStrategy,
  months: MonthsStrategy
}

class Filter {
  constructor(strategy, dispatch, getState) {
    this._strategy = new STRATEGIES[strategy]()
    this._dispatch = dispatch
    this._getState = getState
    this.initializeFilters()
  }

  initializeFilters() {
    this.setFilters(this._strategy.getFilters())
  }

  setFilters() {
    var arg = arguments[0]
    var newFilters = _.isFunction(arg) ?
                     arg.call(this, this.getFilters()) :
                     arg

    this._dispatch({
      type: SET_REPORT_FILTERS,
      payload: this._handleFilters(newFilters)
    })
  }

  setComponentFilter(filterName, value) {
    this.setFilters(prevFilters => ({
      component: {
        ...prevFilters.component,
        [filterName]: value
      }
    }))
  }

  mergeComponentFilter(filterName, inputFilters) {
    var componentFilter = this.getComponentFilters()[filterName]
    var newComponentFilter = []

    inputFilters.forEach(inputFilter => {
      var filter = componentFilter.find(filter =>
                   (filter.value == inputFilter.value))
      newComponentFilter.push(filter || inputFilter)
    })

    this.setComponentFilter(filterName, newComponentFilter)
  }

  getFilters() {
    var state = this._getState()
    return state.filters.reports
  }

  getComponentFilters() {
    return this.getFilters()['component']
  }

  getAppliedFilters() {
    var filters = this.getFilters()
    var appliedFilters = this.mapComponentFilters(
          this.getAppliedComponentFilters(), filter => (filter.value))

    return _.assign({}, filters.default, appliedFilters)
  }

  getAppliedComponentFilters() {
    var filters = this.getFilters().component
    var appliedFilters = {}

    this.mapComponentFilters(filters, (filter, name) => {
      if (!filter.applied) return
      if (!appliedFilters[name]) appliedFilters[name] = []
      appliedFilters[name].push(filter)
    })

    return appliedFilters
  }

  mapComponentFilters(filters, cb) {
    if (!_.isFunction(cb)) throw new Error('callback must be a function')
    var acc = []

    for (let filterName in filters) {
      filters[filterName].forEach((filter, index) => {
        var cbResult = cb.apply(this, [filter, filterName, index])
        if (!acc[filterName]) acc[filterName] = []
        acc[filterName].push(cbResult)
      })
    }

    return acc
  }

  getStrategy() {
    return this._strategy
  }

  createComponentFilter() {
    var args = Array.prototype.slice.call(arguments)
    return this._strategy.createComponentFilter.apply(this, args)
  }


  /*
   * Private methods
   */
  _handleFilters(inputFilters = {}) {
    var newFilters = {}
    var filters = {}

    if (filters = inputFilters.component) {
      this._checkComponentFilters(filters)
      newFilters['component'] = filters
    }

    if (filters = inputFilters.default) {
      newFilters['default'] = filters || null
    }

    return newFilters
  }

  _checkComponentFilters(filters) {
    if (!filters || filters.constructor != Object) {
      throw new Error("'componentFilters' method must return an object")
    }
  }
}

export default function filter(strategy) {
  return function(dispatch, getState) {
    return new Filter(strategy, dispatch, getState)
  }
}
