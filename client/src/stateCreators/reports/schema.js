export default class Schema {
  constructor(strategy) {
    this.strategy = strategy
    this.props    = {}
  }

  state() {
    return {
      items: {
        revenue: { values: [], articles: [] },
        cost: { values: [], articles: [] }
      },
      average: { cost: 0, revenue: 0, profit: 0 },
      total: { cost: 0, revenue: 0, profit: 0 },
      profit: { values: [] }
    }
  }

  article() {
    var { initialValues } = this.props

    return {
      item: this.props.article,
      values: _.cloneDeep(initialValues),
      counterparties: [this.counterparty()]
    }
  }

  counterparty(values) {
    var { initialValues } = this.props

    return {
      item: this.props.counterparty,
      values: _.cloneDeep(initialValues)
    }
  }

  value(value) {
    const { currentFilter } = this.props
    return { item: currentFilter, value }
  }

  filter(item, value = 0) {
    return { item, value }
  }

  setCurrentValues(newProps) {
    this.props = newProps
  }
}
