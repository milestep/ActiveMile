import Schema  from './schema'
import _       from 'lodash'

export class ReportsStateCreator {
  constructor(strategy) {
    this.strategy = strategy
    this.schema   = new Schema()
  }

  generateState(props) {
    this.props          = props
    this.state          = this.getInitialState()
    this.appliedFilters = this.strategy.getPrimaryAppliedFilters()

    this.eachRegister(current => {
      const { localStorage, value, valueAbs } = current

      this.incrementTotalValue()
      this.incrementProfitValue(this.state.profit, valueAbs)
      this.incrementLocalValue(localStorage, value)
      this.mergeArticles()
    })

    this.setTotalProfitValue()
    this.setAverageValues()

    return this.state
  }

  getInitialState() {
    return _.cloneDeep(Schema.state)
  }

  eachRegister(callback) {
    var { registers, articles, counterparties } = this.props

    registers.forEach(register => {
      const articleId = register.article_id,
            countId = register.counterparty_id

      const article = this.search(articles, articleId),
            counterparty = this.search(counterparties, countId),
            articleType = article.type.toLowerCase(),
            { value } = register,
            valueAbs = (articleType == 'revenue' ? value : -value)

      const localStorage = this.state.items[articleType]
      const currentFilter = this.strategy.getCurrentFilterByDate(register.date)
      const initialValues = this.getInitialValues(currentFilter, valueAbs)

      const localArticle = this.searchItem(localStorage.articles, articleId)
      const localCounterparty = localArticle ?
            this.searchItem(localArticle.counterparties, countId) : null

      this.current = {
        article, counterparty,
        localArticle, localCounterparty,
        localStorage, currentFilter, initialValues,
        value, valueAbs, type: articleType
      }

      this.schema.setCurrentValues(this.current)
      callback(this.current)
    })
  }

  mergeArticles() {
    const { localArticle, localStorage, value } = this.current

    if (!localArticle) {
      localStorage.articles.push(this.schema.article())
    } else {
      this.incrementLocalValue(localArticle, value)
      this.mergeCounterparties()
    }
  }

  mergeCounterparties() {
    const { localArticle, localCounterparty, value } = this.current

    if (!localCounterparty) {
      localArticle.counterparties.push(this.schema.counterparty())
    } else {
      this.incrementLocalValue(localCounterparty, value)
    }
  }

  setTotalProfitValue() {
    var { total } = this.state
    total.profit = total.revenue + total.cost
  }

  setAverageValues() {
    var { total, average } = this.state,
        appliedLength = this.appliedFilters.length,
        newAverage = {}

    for (var type in average) {
      var value = total[type] / appliedLength
      newAverage[type] = Math.ceil(value);
    }
     this.state.average = newAverage
  }

  incrementTotalValue() {
    const { type, valueAbs } = this.current
    this.state.total[type] += valueAbs
  }

  incrementLocalValue(storage, valueAbs) {
    var localValue = this.searchLocalValue(storage)
    var { initialValues } = this.current
    if (!localValue) {
      storage.values = _.cloneDeep(initialValues)
    } else {
        if (this.current.type == 'revenue') {
          localValue.value += valueAbs
        } else {
          localValue.value -= valueAbs
      }
    }
  }

  incrementProfitValue(storage, valueAbs) {
    var localValue = this.searchLocalValue(storage)
    var { initialValues } = this.current
    if (!localValue) {
      storage.values = _.cloneDeep(initialValues)
    } else {
      localValue.value += valueAbs
    }
  }

  getInitialValues(currentFilter, value) {
    return this.appliedFilters.map(item => {
      var filterValue = 0

      if (currentFilter.value == item.value) {
        filterValue = value
      }

      return this.schema.filter(item, filterValue)
    })
  }

  searchLocalValue(storage) {
    if (!storage.values) return
    const { currentFilter } = this.current
    return storage.values.find(filter => (
      filter.item.value == currentFilter.value
    ))
  }

  search(storage, value, item = false) {
    if (!storage.length) return

    return storage.find(obj => {
      var objValue = item ? obj.item : obj
      return objValue['id'] == value
    })
  }

  searchItem(storage, value) {
    return this.search(storage, value, true)
  }
}
