import { FilterStrategy } from '../../lib/filter'
import _                  from 'lodash'

export default class YearsStrategy extends FilterStrategy {
  constructor() {
    super({ filterBy: 'year' })
  }

  componentFilters() {
    var currentYear = new Date().getFullYear()
    return [ this.createComponentFilter(currentYear, currentYear, true) ]
  }

  getCurrentFilterByDate(date) {
    var year = date.getFullYear()
    var filters = this._filter.getComponentFilters()
    return filters.find(filter => (filter.value == year))
  }

  onDataReceived() {
    var store = this._filter.getState()
    this._mergeYears(store.registers.years)
  }

  _mergeYears(filterYears) {
    var currentYear = new Date().getFullYear()
    var newYears = _.concat(_.difference(
        [currentYear], filterYears), filterYears).sort()
    var newFilters = newYears.map(year => (this.createComponentFilter(year)))
    var filters = this._filter.getComponentFilters()
    var mergedFilters = []

    newFilters.forEach(newFilter => {
      var filter = filters.find(f => (f.value == newFilter.value))
      mergedFilters.push(filter || newFilter)
    })

    this._filter.setFilters({ component: mergedFilters })
  }
}
