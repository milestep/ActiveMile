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
    return {
      item: this.props.article,
      values: [this.value(this.props.value)],
      counterparties: [this.counterparty()]
    }
  }

  counterparty() {
    return {
      item: this.props.counterparty,
      values: [this.value(this.props.value)]
    }
  }

  value(value) {
    const { currentFilter } = this.props
    return { item: currentFilter, value }
  }

  filter(item, value) {
    return { item, value }
  }

  setCurrentValues(newProps) {
    this.props = newProps
  }
}
