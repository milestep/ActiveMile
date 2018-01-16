import { Filter } from '../../lib/filter'
import moment     from 'moment'
import _          from 'lodash'

export default class ReportsStrategy {
  constructor(props) {
    this.props  = props

    this.filter = new Filter({
      name: props.name,
      action: props.action,
      filters: this.componentFilters()
    })

    this.primaryFilter = this.primaryFilterName()
  }

  getFilters() {
    return this.filter.getFilters()
  }

  updateFilters(filters) {
    this.filter.updateFilters(filters)
  }

  getPrimaryFilter() {
    return this.getFilters()[this.primaryFilter]
  }

  getAppliedFilters(options = {}) {
    var defaults = { pluck: null }
    var filters = this.getFilters()
    var appliedFilters = {}

    options = _.assign({}, defaults, options)

    for (var name in filters) {
      var filter = filters[name]

      appliedFilters[name] = []

      filter.forEach(item => {
        if (!item.applied) return
        var { pluck } = options

        if (pluck && _.isString(pluck) && item[pluck]) {
          item = item[pluck]
        }

        appliedFilters[name].push(item)
      })
    }

    return appliedFilters
  }

  onDataReceived() {
    this._mergeYears()
  }

  getStore() {
    return this.props.action.getState()
  }

  getCurrentFilterByValue(date) {
    var filter = this.getPrimaryFilter()
    return filter.find(item => (item.value == date))
  }


  /*
   * Private methods
   */
  _mergeYears() {
    var filterYears = this.getStore().registers.years
    var newItems = this._getNewFilters(filterYears)
    var filters = this.getFilters().year
    var mergedFilters = []

    newItems.forEach(newItem => {
      var item = filters.find(i => (i.value == newItem.value))
      mergedFilters.push(item || newItem)
    })

    this.updateFilters({ year: mergedFilters })
  }

  _getNewFilters(years) {
    var currentYear = new Date().getFullYear()
    var newYears = _.concat(_.difference([currentYear], years), years).sort()
    return newYears.map(newYear => ({ value: newYear }))
  }


  /*
   * Abstract methods
   */
  componentFilters() {
    throw new Error("Component filters must be present")
  }

  primaryFilter() {
    throw new Error("Primary filter must be specified")
  }
}
