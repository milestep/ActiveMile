import { FilterStrategy } from '../../lib/filter'
import moment             from 'moment'

export default class MonthsStrategy extends FilterStrategy {
  constructor() {
    super()
    this.filterBy('month')
  }

  componentFilters() {
    var currentMonth = new Date().getMonth()
    var monthsNames = moment.monthsShort()

    return monthsNames.map((month, index) =>
           (this.createComponentFilter(
             index + 1,
             month,
             index == currentMonth)
           ))
  }

  defaultFilters() {
    return { year: new Date().getFullYear() }
  }
}
