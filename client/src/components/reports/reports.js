import React, { Component, PropTypes }    from 'react'
import { bindActionCreators }             from 'redux'
import { connect }                        from 'react-redux'
import { toaster }                        from '../../actions/alerts'
import { actions as subscriptionActions } from '../../actions/subscriptions'
import { actions as workspaceActions }    from '../../actions/workspaces'
import { index as fetchRegisters }        from '../../actions/registers'
import { setStatePromise, pushUnique }    from '../../utils'
import ReactHTMLTableToExcel              from 'react-html-table-to-excel'
import Workbook                           from 'react-excel-workbook'
import MonthsStrategy                     from './strategies/months'
import YearsStrategy                      from './strategies/years'
import Filters                            from './filters'
import _                                  from 'lodash'


const strategies = {
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
    toaster,
    fetchRegisters
  }, dispatch)
}))
export default class Reports extends Component {
  constructor(props) {
    super(props)

    this.types = ['Revenue', 'Cost']
    this.subscriptions = ['articles', 'counterparties']
    this.toaster = props.actions.toaster()
    this.strategy = strategies[props.strategy]()

    this.state = {
      filters: this.strategy.getFilters()
    }

    this.onTabClick = this.onTabClick.bind(this)
  }

  componentWillMount() {
    this.fetchRegisters()
  }

  fetchRegisters() {
    var { actions } = this.props
    var params = this.getAppliedFilters()

    actions.fetchRegisters(params).then(() => {
      actions.subscribe(this.subscriptions)
        .then(() => {
          // TODO create reports based on registers
        })
        .catch(err => console.error(err))
    })
  }

  onTabClick(filterName, id) {
    var filter = this.state.filters[filterName]
    var newFilter = _.assign([], filter)

    newFilter[id].applied = !filter[id].applied
    this.changeFilter(filterName, newFilter)
  }

  changeFilter(filterName, value) {
    setStatePromise(this, prevState => ({
      filters: {
        ...prevState.filters,
        [filterName]: value
      }
    })).then(() => {
      this.fetchRegisters()
    })
  }

  getAppliedFilters() {
    var defaultFilters = this.strategy.getFilters('default')
    var { filters } = this.state
    var appliedFilters = {}

    for (let filterName in filters) {
      filters[filterName].forEach(componentFilter => {
        if (!componentFilter.applied) return
        appliedFilters[filterName] = appliedFilters[filterName] || []
        appliedFilters[filterName].push(componentFilter.value)
      })
    }

    return _.assign({}, defaultFilters, appliedFilters)
  }

  render() {
    const { filters } = this.state

    return(
      <div className='row'>
        <div className='col-md-12'>
          <Filters
            filters={this.state.filters}
            onTabClick={this.onTabClick}
          />
        </div>
      </div>
    )
  }
}
