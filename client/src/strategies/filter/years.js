import { FilterStrategy } from '../../lib/filter'
import _                  from 'lodash'

export default class YearsStrategy extends FilterStrategy {
  constructor() {
    super()
    this.filterBy('year')
  }

  componentFilters() {
    var currentYear = new Date().getFullYear()
    return [ this.createComponentFilter(currentYear, currentYear, true) ]
  }

  onDataReceived(filter, props) {
    var { filterYears } = props
    this._mergeYears(filter, filterYears)
  }

  _mergeYears(filter, filterYears) {
    var currentYear = new Date().getFullYear()
    var newYears = _.concat(_.difference(
        [currentYear], filterYears), filterYears).sort()
    var newFilters = newYears.map(year => (this.createComponentFilter(year)))
    var filters = filter.getComponentFilters()
    var mergedFilters = []

    newFilters.forEach(newFilter => {
      var filter = filters.find(f => (f.value == newFilter.value))
      mergedFilters.push(filter || newFilter)
    })

    filter.setFilters({ component: mergedFilters })
  }
}
