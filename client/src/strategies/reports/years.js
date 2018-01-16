import ReportsStrategy from './reports'

export class YearsStrategy extends ReportsStrategy {
  constructor(props) {
    super({ ...props,
      name: 'reportByYears'
    })
  }

  componentFilters() {
    return { year: [{
      value: new Date().getFullYear(),
      applied: true
    }] }
  }

  primaryFilterName() {
    return 'year'
  }


  /*
   * Helper methods
   */
  getCurrentFilterByDate(date) {
    var year = new Date(date).getFullYear()
    return this.getCurrentFilterByValue(year)
  }
}

export function yearsStrategy() {
  return (dispatch, getState) => (new YearsStrategy({
    action: { dispatch, getState }
  }))
}
