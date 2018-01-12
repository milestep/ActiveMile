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
import reportsStateCreator                from './stateCreators'

const STRATEGIES = {
  months: MonthsStrategy,
  years: YearsStrategy
}

@connect(state => ({
  nextWorkspace: state.workspaces.app.next,
  isResolved: {
    articles: state.subscriptions.articles.resolved,
    counterparties: state.subscriptions.counterparties.resolved
  }
}), dispatch => ({
  actions: bindActionCreators({
    ...subscriptionActions,
    ...workspaceActions,
    reportsStateCreator,
    fetchRegisters,
    toaster,
    filter,
  }, dispatch),
  stateCreator: dispatch(reportsStateCreator),
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
    var stateCreator = this.props.stateCreator({
      filter: this.filter,
      strategy: this.strategy
    })

    stateCreator.generate()

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
