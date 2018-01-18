import React, { Component, PropTypes }    from 'react'
import { bindActionCreators }             from 'redux'
import { connect }                        from 'react-redux'
import _                                  from 'lodash'
import ReactHTMLTableToExcel              from 'react-html-table-to-excel'
import Workbook                           from 'react-excel-workbook'
import { toaster }                        from '../../actions/alerts'
import { setStatePromise, pushUnique }    from '../../utils'
import { actions as subscriptionActions } from '../../actions/subscriptions'
import { actions as workspaceActions }    from '../../actions/workspaces'
import { index as fetchRegisters }        from '../../actions/registers'
import { monthsStrategy, yearsStrategy }  from '../../strategies/reports'
import ReportsStateCreator                from '../../stateCreators/reports'

@connect(state => ({
  registers: state.registers.items,
  articles: state.articles.items,
  filterYears: state.registers.years,
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
    this.strategy = this.setStrategy()
    this.toaster = props.actions.toaster()
  }

  setStrategy() {
    var { strategies, strategy } = this.props

    return strategies[strategy]({
      events: {
        onFilterChange: this.onFilterChange.bind(this)
      }
    })
  }

  componentWillMount() {
    this.fetchRegisters()
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions)
  }

  onFilterChange() {
    this.fetchRegisters()
  }

  onDataReceived() {
    this.updateYears()
    this.initializeState()
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

  initializeState() {
    var { strategy } = this
    var filters = strategy.getPrimaryFilter()
    var { registers, articles, counterparties } = this.props
    var stateCreator = new ReportsStateCreator({
      getCurrentFilterByDate: strategy.getCurrentFilterByDate.bind(strategy),
      models: { registers, articles, counterparties, filters }
    })

    stateCreator.generateState()

    this.setState({
      filters: stateCreator.getState()
    })
  }

  updateYears() {
    var { filterYears } = this.props,
        filters = this.strategy.getFilters(),
        diff = _.difference([new Date().getFullYear()], filterYears),
        newYears = _.concat(diff, filterYears).sort(),
        newItems = newYears.map(newYear => ({ value: newYear })),
        mergedFilters = []

    newItems.forEach(newItem => {
      var item = filters.year.find(i => (i.value == newItem.value))
      mergedFilters.push(item || newItem)
    })

    this.strategy.updateFilters({ year: mergedFilters })
  }

  render() {
    const { Filter } = this.strategy

    return(
      <div className='row'>
        <div className='col-md-12'>
          <div className='reports-filter'>
            <Filter />
          </div>
        </div>
      </div>
    )
  }
}
