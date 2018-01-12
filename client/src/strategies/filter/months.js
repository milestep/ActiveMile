import { FilterStrategy } from '../../lib/filter'
import moment             from 'moment'

export default class MonthsStrategy extends FilterStrategy {
  constructor() {
    super({ filterBy: 'month' })
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

  getCurrentFilterByDate(date) {
    var month = date.getMonth() + 1
    var filters = this._filter.getComponentFilters()
    return filters.find(filter => (filter.value == month))
  }
}
