import ReportsStrategy from './reports'
import moment          from 'moment'

class MonthsStrategy extends ReportsStrategy {
  constructor(props) {
    super({ ...props,
      name: 'reportByMonths'
    })
  }

  componentFilters() {
    var date = new Date()
    var currentMonth = date.getMonth()
    var currentYear = date.getFullYear()
    var monthsNames = moment.monthsShort()

    var year = [{ value: currentYear, applied: true }]
    var month = monthsNames.map((name, index) => ({
      name,
      value: index + 1,
      applied: index == currentMonth
    }))

    return { year, month }
  }

  primaryFilterName() {
    return 'month'
  }


  /*
   * Helper methods
   */
  getCurrentFilterByDate(date) {
    var month = new Date(date).getMonth() + 1
    return this.getCurrentFilterByValue(month)
  }
}

export function monthsStrategy() {
  return (dispatch, getState) => (new MonthsStrategy({
    action: { dispatch, getState }
  }))
}
