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
import ReportsStateCreator                from './stateCreators'
import ArticlesList                       from './articlesList'

const STRATEGIES = {
  months: MonthsStrategy,
  years: YearsStrategy
}

@connect(state => ({
  registers: state.registers.items,
  articles: state.articles.items,
  counterparties: state.counterparties.items,
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
      filters: { cost: [], revenue: [] }
    }

    this.types = ['Revenue', 'Cost']
    this.subscriptions = ['articles', 'counterparties']
    this.strategy = new STRATEGIES[props.strategy]()
    this.filter = props.actions.filter('report', this.strategy)
    this.toaster = props.actions.toaster()

    this.onTabClick = this.onTabClick.bind(this)
  }

  componentWillMount() {
    this.fetchRegisters()
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions)
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
    this.filter.emitEvent('onDataReceived')
    this.initializeState()
  }

  initializeState() {
    var { registers, articles, counterparties } = this.props

    var stateCreator = new ReportsStateCreator({
      filter: this.filter,
      strategy: this.strategy,
      models: { registers, articles, counterparties }
    })

    stateCreator.generateState()

    this.setState({
      filters: stateCreator.getState()
    })
  }

  onTabClick(id) {
    var filters = this.filter.getComponentFilters()
    var newFilters = _.assign([], filters)
    newFilters[id].applied = !filters[id].applied
    this.filter.setFilters({ component: newFilters })
    this.fetchRegisters()
    this.printCurrentFilter()
  }

  render() {
    const componentFilters = this.filter.getComponentFilters()
    const { filters } = this.state
    const revenue = filters.revenue.map((revenue, index) => (
      revenue.item.applied ? <div className="col-md-1" key={index}><p>{revenue.value}</p></div> : null
    ))

    const filterName = filters.revenue.map((revenue, index) => (
      revenue.item.applied ? <div className="col-md-1" key={index}><p>{revenue.item.name}</p></div> : null
    ))

    const cost = filters.cost.map((cost, index) => (
      cost.item.applied ? <div className="col-md-1" key={index}><p>{cost.value}</p></div> : null
    ))



    console.log(filters)
    return(
      <div className='row'>
        <div className='col-md-12'>
          <Filter
            filters={componentFilters}
            onTabClick={this.onTabClick}
          />
        </div>
        <div className="reports">
          <div className="col-md-offeset-2 col-md-10 pull-right">
            {filterName}
          </div>
          <div className="clearfix"></div>
          <div className="col-md-2 revenue"><p>Revenue:</p></div>
          <div className="col-md-10">
            {revenue}
          </div>
          <ArticlesList 
            filters = {filters}
            type = {filters.revenue}
          />
          <div className="clearfix"></div>
          <div className="col-md-2 cost"><p>Cost:</p></div>
          <div className="col-md-10">
            {cost}
          </div>
          <ArticlesList 
            filters = {filters}
            type = {filters.cost}
          />
        </div>
      </div>
    )
  }
}
