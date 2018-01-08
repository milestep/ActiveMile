import React, { Component, PropTypes }    from 'react'
import { bindActionCreators }             from 'redux'
import { connect }                        from 'react-redux'
import _                                  from 'lodash'
import ReactHTMLTableToExcel              from 'react-html-table-to-excel'
import Workbook                           from 'react-excel-workbook'
import { toaster }                        from '../../actions/alerts'
import { actions as subscriptionActions } from '../../actions/subscriptions'
import { actions as workspaceActions }    from '../../actions/workspaces'
import { index as fetchRegisters }        from '../../actions/registers'
import { setStatePromise, pushUnique }    from '../../utils'
import filter                             from '../../lib/filter'
import MonthsStrategy                     from '../../strategies/filter/months'
import YearsStrategy                      from '../../strategies/filter/years'
import Filter                             from './filter'

const STRATEGIES = {
  months: MonthsStrategy,
  years: YearsStrategy
}

@connect(state => ({
  registers: state.registers.items,
  articles: state.articles.items,
  counterparties: state.counterparties.items,
  filterYears: state.registers.years,
  nextWorkspace: state.workspaces.app.next,
  isResolved: {
    articles: state.subscriptions.articles.resolved,
    counterparties: state.subscriptions.counterparties.resolved
  }
}), dispatch => ({
  actions: bindActionCreators({
    ...subscriptionActions,
    ...workspaceActions,
    fetchRegisters,
    toaster,
    filter,
  }, dispatch)
}))
export default class Reports extends Component {
  constructor(props) {
    super(props)

    this.state = {
      articles: []
    }

    this.types = ['Revenue', 'Cost']
    this.subscriptions = ['articles', 'counterparties']

    var strategy = new STRATEGIES[props.strategy]()
    this.filter = props.actions.filter('report', strategy)
    this.toaster = props.actions.toaster()

    this.onTabClick = this.onTabClick.bind(this)
  }

  componentWillMount() {
    this.fetchRegisters()
  }

  fetchRegisters() {
    var { actions } = this.props
    var params = this.filter.getAppliedFilters()

    actions.fetchRegisters(params).then(() => {
      actions.subscribe(this.subscriptions)
        .then(() => this.onDataReceived())
        .catch(err => console.error(err))
    })
  }

  onDataReceived() {
    this.filter.emitEvent('onDataReceived', this.props)
    this.initializeState()
  }

  initializeState() {
    var { registers, articles, counterparties } = this.props
    var newState = {
      articles: []
    }
    var currentRegister = null

    registers.forEach(register => {
      currentRegister = register
      var articleId = register.article_id
      var article = findArticle(articleId)
      var localArticle = findLocalArticle(articleId)

      if (!localArticle) {
        addArticle(article)
      } else {
        mergeArticles(localArticle, article)
      }
    })

    function addArticle(article) {
      newState.articles.push(createArticle(article))
    }

    function mergeArticles(localArticle, article) {
      var counterpartyId = currentRegister.counterparty_id
      var counterparty = findCounterparty(counterpartyId)
      var localCounterparty = findLocalCounterparty(localArticle, counterpartyId)

      localArticle.value += currentRegister.value

      if (!localCounterparty) {
        addCounterparty(localArticle, counterparty)
      } else {
        changeValue(localCounterparty)
      }
    }

    function addCounterparty(localArticle, counterparty) {
      localArticle.counterparties.push(createCounterParty(counterparty))
    }

    function changeValue(localCounterparty) {
      localCounterparty.value += currentRegister.value
    }

    function createArticle(article) {
      var counterparty = findCounterparty(currentRegister.counterparty_id)

      return {
        item: article,
        value: getValue(),
        counterparties: [ createCounterParty(counterparty) ]
      }
    }

    function createCounterParty(counterparty) {
      return { item: counterparty, value: getValue() }
    }

    function findArticle(id) {
      return articles.find(article => (article.id == id))
    }

    function findLocalArticle(id) {
      return newState.articles.find(article => (article.item.id == id))
    }

    function findCounterparty(id) {
      return counterparties.find(counterparty => (counterparty.id == id))
    }

    function findLocalCounterparty(localArticle, id) {
      return localArticle.counterparties
               .find(counterparty => (counterparty.item.id == id))
    }

    function getValue() {
      return currentRegister.value
    }
  }

  onTabClick(id) {
    var filters = this.filter.getComponentFilters()
    var newFilters = _.assign([], filters)

    newFilters[id].applied = !filters[id].applied
    this.filter.setFilters({ component: newFilters })
    this.fetchRegisters()
  }

  render() {
    const componentFilters = this.filter.getComponentFilters()

    return(
      <div className='row'>
        <div className='col-md-12'>
          <Filter
            filters={componentFilters}
            onTabClick={this.onTabClick}
          />
        </div>
      </div>
    )
  }
}
