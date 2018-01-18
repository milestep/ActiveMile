import ReportsStrategy  from './reports'
import YearsFilter      from '../../components/reports/filters/years'

export class YearsStrategy extends ReportsStrategy {
  componentFilters() {
    return { year: [{
      value: new Date().getFullYear(),
      applied: true
    }] }
  }

  primaryFilterName() {
    return 'year'
  }

  renderComponent() {
    return { component: YearsFilter }
  }


  /*
   * Helper methods
   */
  getCurrentFilterByDate(date) {
    var year = new Date(date).getFullYear()
    return this.getCurrentFilterByValue(year)
  }
}

export function yearsStrategy(props) {
  return (dispatch, getState) => (new YearsStrategy({
    ...props,
    action: { dispatch, getState }
  }))
}
