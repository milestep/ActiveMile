import FilterStrategy from '../strategy'

export default class YearsStrategy extends FilterStrategy {
  componentFilters() {
    var currentYear = new Date().getFullYear()

    return {
      year: [ this.createComponentFilter(currentYear, currentYear, true) ]
    }
  }
}
