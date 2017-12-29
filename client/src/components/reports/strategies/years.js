import FilterStrategy from './filterStrategy'

class Strategy extends FilterStrategy {
  componentFilters() {
    var currentYear = new Date().getFullYear()

    return [this.createComponentFilter(
      currentYear, currentYear, true
    )]
  }
}

export default function YearsStrategy() {
  return new Strategy({ filterBy: 'year' })
}
