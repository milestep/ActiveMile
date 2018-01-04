import FilterStrategy from '../strategy'
import moment         from 'moment'
import _              from 'lodash'

export default class MonthsStrategy extends FilterStrategy {
  componentFilters() {
    var currentMonth = new Date().getMonth()
    var monthsNames = moment.monthsShort()

    return {
      month: monthsNames.map((month, index) => {
        var applied = index == currentMonth
        return this.createComponentFilter(index + 1, month, applied)
      })
    }
  }

  defaultFilters() {
    return { year: new Date().getFullYear() }
  }
}
