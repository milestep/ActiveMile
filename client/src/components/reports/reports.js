import React, { Component, PropTypes }    from 'react'
import { bindActionCreators }             from 'redux'
import { connect }                        from 'react-redux'
import { toaster }                        from '../../actions/alerts'
import { actions as subscriptionActions } from '../../actions/subscriptions'
import { actions as workspaceActions }    from '../../actions/workspaces'
import { index as fetchRegisters }        from '../../actions/registers'
import filter                             from '../../actions/filter'
import { setStatePromise, pushUnique }    from '../../utils'
import ReactHTMLTableToExcel              from 'react-html-table-to-excel'
import Workbook                           from 'react-excel-workbook'
import Filters                            from './filters'
import _                                  from 'lodash'

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

    this.types = ['Revenue', 'Cost']
    this.subscriptions = ['articles', 'counterparties']
    this.toaster = props.actions.toaster()
    this.filter = props.actions.filter(props.strategy)

    this.state = {
      articles: []
    }

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
        .then(() => this.onReceivedData())
        .catch(err => console.error(err))
    })
  }

  onReceivedData() {
    this.updateFilterYears()
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

    console.log(newState)


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

  onTabClick(filterName, id) {
    var filter = this.filter.getComponentFilters()[filterName]
    var newFilter = _.assign([], filter)

    newFilter[id].applied = !filter[id].applied
    this.filter.setComponentFilter(filterName, newFilter)
    this.fetchRegisters()
  }

  updateFilterYears() {
    if (this.props.strategy != 'years') return
    var strategy = this.filter.getStrategy()
    this.filter.mergeComponentFilter('year',
        strategy.mergeYears(this.props.filterYears))
  }

  render() {
    const componentFilters = this.filter.getComponentFilters()

    return(
      <div className='row'>
        <div className='col-md-12'>
          <Filters
            filters={componentFilters}
            onTabClick={this.onTabClick}
          />
        </div>
      </div>
    )
  }
}
