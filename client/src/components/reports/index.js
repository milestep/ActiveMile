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
import { monthsStrategy, yearsStrategy }  from '../../strategies/reports'
import Filter                             from './filter'
import ReportsStateCreator                from './stateCreators'

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
  strategies: bindActionCreators({
    months: monthsStrategy,
    years: yearsStrategy
  }, dispatch),
  actions: bindActionCreators({
    ...subscriptionActions,
    ...workspaceActions,
    fetchRegisters,
    toaster,
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
    this.strategy = props.strategies[props.strategy]()
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
    var params = this.strategy.getAppliedFilters({ pluck: 'value' })

    actions.fetchRegisters(params).then(() => {
      actions.subscribe(this.subscriptions)
        .then(() => this.onDataReceived())
        .catch(err => console.error(err))
    })
  }

  onDataReceived() {
    this.strategy.onDataReceived()
    this.initializeState()
  }

  initializeState() {
    var { registers, articles, counterparties } = this.props

    var stateCreator = new ReportsStateCreator({
      strategy: this.strategy,
      models: { registers, articles, counterparties }
    })

    stateCreator.generateState()

    this.setState({
      filters: stateCreator.getState()
    })
  }

  onTabClick(id) {
    var filters = this.strategy.getPrimaryFilter()
    var newFilters = _.assign([], filters)

    newFilters[id].applied = !filters[id].applied

    this.strategy.updateFilters({
      [this.strategy.primaryFilter]: newFilters
    })

    this.fetchRegisters()
  }

  render() {
    const filters = this.strategy.getPrimaryFilter()

    return(
      <div className='row'>
        <div className='col-md-12'>
          <Filter
            filters={filters}
            onTabClick={this.onTabClick}
          />
        </div>
      </div>
    )
  }
}
