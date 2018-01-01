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
        .then(() => this.onReceivedRegisters())
        .catch(err => console.error(err))
    })
  }

  onTabClick(filterName, id) {
    var filters = this.filter.getFilters()
    var filter = filters.component[filterName]
    var newFilter = _.assign([], filter)

    newFilter[id].applied = !filter[id].applied
    this.filter.setComponentFilter(filterName, newFilter)
    this.fetchRegisters()
  }

  onReceivedRegisters() {
    this.updateFilterYears()
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
