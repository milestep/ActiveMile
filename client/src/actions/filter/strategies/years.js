import FilterStrategy from '../strategy'
import _              from 'lodash'

export default class YearsStrategy extends FilterStrategy {
  componentFilters() {
    var currentYear = new Date().getFullYear()

    return {
      year: [ this.createComponentFilter(currentYear, currentYear, true) ]
    }
  }

  mergeYears(filterYears) {
    var newYears = _.concat(_.difference(
      [new Date().getFullYear()], filterYears),
      filterYears).sort()

    return newYears.map(year => (this.createComponentFilter(year)))
  }
}
