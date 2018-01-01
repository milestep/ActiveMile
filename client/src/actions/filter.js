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
    this.strategy = new STRATEGIES[strategy]()
    this._dispatch = dispatch
    this._getState = getState
    this.initializeFilters()
  }

  initializeFilters() {
    this.setFilters(this.strategy.getFilters())
  }

  getFilters() {
    var state = this._getState()
    return state.filters.reports
  }

  setFilters(filters) {
    this._dispatch({
      type: SET_REPORT_FILTERS,
      payload: this.strategy.handleFilters(filters)
    })
  }
}

export default function filter(strategy) {
  return function(dispatch, getState) {
    return new Filter(strategy, dispatch, getState)
  }
}
