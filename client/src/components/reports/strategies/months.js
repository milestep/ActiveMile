import FilterStrategy from './filterStrategy'
import moment         from 'moment'

class Strategy extends FilterStrategy {
  componentFilters() {
    var currentMonth = new Date().getMonth()
    var monthsNames = moment.monthsShort()

    return {
      month: monthsNames.map((month, index) => {
        var applied = index == currentMonth
        return this.createComponentFilter(index, month, applied)
      })
    }
  }

  defaultFilters() {
    return { year: new Date().getFullYear() }
  }
}

export default function MonthsStrategy() {
  return new Strategy()
}
