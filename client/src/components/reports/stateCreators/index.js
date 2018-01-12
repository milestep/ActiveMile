class ReportsStateCreator {
  constructor(props) {
    this.props = props

    this.state = this._createInitialState()
    this.current = { register: null, article: null, counterparty: null }

    this.initializeModels()
  }

  initializeModels() {
    var store = this.props.getState()

    this.models = {
      registers: store.registers.items,
      articles: store.articles.items,
      counterparties: store.counterparties.items
    }
  }

  generate() {
    var { registers, articles, counterparties } = this.models

    registers.forEach(register => {
      this.setCurrent({
        register,
        article: this._find(articles, register.article_id),
        counterparty: this._find(counterparties, register.counterparty_id)
      })

      var current = this.current
      var currentFilter = this._getCurrentFilter()
      var localArticle = this._findLocal(currentFilter.articles, current.article)

      currentFilter.value += register.value

      if (!localArticle) {
        this._addArticleTo(currentFilter)
      } else {
        this._mergeWithCurrentArticle(localArticle)
      }
    })

    console.log(this.state)
  }

  setCurrent(newCurrent) {
    this.current = { ...this.current, ...newCurrent }
  }

  getState() {
    return this.state
  }

  _createInitialState() {
    var componentFilters = this.props.filter.getComponentFilters()
    var stateItems = () => (componentFilters
          .map(filter => (this._localFilter(filter))))
    return { cost: stateItems(), revenue: stateItems() }
  }

  _getCurrentFilter() {
    var { strategy } = this.props
    var { register, article } = this.current
    var filter = strategy.getCurrentFilterByDate(new Date(register.date))
    var currentState = this.state[article.type.toLowerCase()]
    return this._findLocal(currentState, filter, { by: 'value' })
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

export default function reportsStateCreator(dispatch, getState) {
  return props => (new ReportsStateCreator({ ...props, getState }))
}
