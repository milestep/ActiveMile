export default class ReportsStateCreator {
  constructor(props) {
    this.props = props
    this.state = this._createInitialState()
    this.current = { register: null, article: null, counterparty: null }
  }

  generateState() {
    var { registers, articles, counterparties } = this.props.models

    registers.forEach(register => {
      this.setCurrent({
        register,
        article: this._find(articles, register.article_id),
        counterparty: this._find(counterparties, register.counterparty_id)
      })

      var current = this.current,
          { value } = register,
          { article } = current,
          articleType = article.type.toLowerCase(),
          absValue = article.type == 'Revenue' ? value : - value,
          { currentFilter, currentProfit } = this._getCurrentFilter(),
          localArticle = this._findLocal(currentFilter.articles, article)

      currentFilter.value           += value
      currentProfit.value           += absValue
      this.state.total.profit       += absValue
      this.state.total[articleType] += value

      if (!localArticle) {
        this._addArticleTo(currentFilter)
      } else {
        this._mergeWithCurrentArticle(localArticle)
      }
    })


    this._setAverageValues()
  }

  setCurrent(newCurrent) {
    this.current = { ...this.current, ...newCurrent }
  }

  getState() {
    return this.state
  }

  _createInitialState() {
    var { filters } = this.props.models
    var profitItems = []
    var stateItems = []

    filters.forEach(item => {
      stateItems.push(this._localFilter(item))
      profitItems.push({ value: 0, item })
    })

    return {
      total: { cost: 0, revenue: 0, profit: 0 },
      average: { cost: 0, revenue: 0, profit: 0 },
      items: { cost: stateItems, revenue: stateItems, profit: profitItems }
    }
  }

  _setAverageValues() {
    var { total, average } = this.state,
        { appliedFilters } = this.props.models,
        appliedLength = appliedFilters.length,
        newAverage = {}

    for (var type in average) {
      var value = total[type] / appliedLength
      newAverage[type] = Math.ceil(value)
    }

    this.state.average = newAverage
  }

  _getCurrentFilter() {
    var { items, total } = this.state
    var { register, article } = this.current
    var filter = this.props.getCurrentFilterByDate(register.date)
    var articleType = article.type.toLowerCase()

    return {
      currentFilter: this._findLocal(items[articleType], filter, { by: 'value' }),
      currentProfit: this._findLocal(items.profit, filter, { by: 'value' })
    }
  }

  _addArticleTo(currenFilter) {
    currenFilter.articles.push(this._localArticle(this.current.article))
  }

  _addCounterpartyTo(localArticle) {
    var { counterparty } = this.current
    localArticle.counterparties.push(this._localCounterparty(counterparty))
  }

  _mergeWithCurrentArticle(localArticle) {
    var { register, article, counterparty } = this.current
    var localCounterparty = this._findLocal(localArticle.counterparties, counterparty)

    localArticle.value += register.value

    if (!localCounterparty) {
      this._addCounterpartyTo(localArticle)
    } else {
      localCounterparty.value += register.value
    }
  }

  _localFilter(filter) {
    return {
      item: filter,
      value: 0,
      articles: []
    }
  }

  _localArticle(article) {
    var { counterparty } = this.current

    return {
      item: article,
      value: this._getCurrentValue(),
      counterparties: [ this._localCounterparty(counterparty) ]
    }
  }

  _localCounterparty(counterparty) {
    return { item: counterparty, value: this._getCurrentValue() }
  }

  _find(storage, item) {
    return storage.find(obj => (obj.id == item))
  }

  _findLocal(storage, item, options = {}) {
    var { by } = _.assign({ by: 'id' }, options)
    return storage.find(obj => (obj.item[by] == item[by]))
  }

  _getCurrentValue() {
    return this.current.register.value
  }
}
