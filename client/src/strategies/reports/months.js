import ReportsStrategy  from './reports'
import MonthsFilter     from '../../components/reports/filters/months'

class MonthsStrategy extends ReportsStrategy {
  componentFilters() {
    var date = new Date()
    var currentMonth = date.getMonth()
    var currentYear = date.getFullYear()
    var monthsNames = ["Jan", "Feb", "Mar", "Apr",
                       "May", "Jun", "Jul", "Aug",
                       "Sep", "Oct", "Nov", "Dec"]

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

/* props = {
      events: {
        onFilterChange: this.onFilterChange.bind(this)
      }
    } */

export function monthsStrategy(props) {
  return (dispatch, getState) => (new MonthsStrategy({
    ...props,
    action: { dispatch, getState }
  }))
}
