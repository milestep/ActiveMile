import FilterStrategy from './filterStrategy'
import moment         from 'moment'

class Strategy extends FilterStrategy {
  componentFilters() {
    var currentMonth = new Date().getMonth()

    return moment.monthsShort().map((month, index) =>
          (this.createComponentFilter(index, month, index == currentMonth)))
  }

  defaultFilters() {
    return { year: new Date().getFullYear() }
  }
}

export default function MonthsStrategy() {
  return new Strategy({ filterBy: 'month' })
}
