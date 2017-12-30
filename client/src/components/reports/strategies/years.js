import FilterStrategy from './filterStrategy'

class Strategy extends FilterStrategy {
  componentFilters() {
    var currentYear = new Date().getFullYear()

    return {
      year: [ this.createComponentFilter(currentYear, null, true) ]
    }
  }
}

export default function YearsStrategy() {
  return new Strategy()
}
