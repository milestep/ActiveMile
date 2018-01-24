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
import { ReportsStateCreator }            from '../../stateCreators/reports'
import ArticlesList                       from './articlesList'

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
    var { registers, articles, counterparties } = this.props

    if (!registers || !registers.length) return

    var stateCreator = new ReportsStateCreator({
      strategy: this.strategy,
      models: { registers, articles, counterparties }
    })

    this.setState({
      filters: stateCreator.generateState()
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

  fetchClassName(display_total, display_avg) {
    let className
    if (display_total && !display_avg || !display_total && display_avg){
      className = 'col-xs-9'
    }
    else if (display_total && display_avg){
      className = 'col-xs-8'
    }
    else{
      className = 'col-xs-10'
    }
    return className
  }

  totalPrint() {
    this.setState((prevState) => ({
      display_total: !prevState.display_total
    }));
  }

  avgPrint() {
    this.setState((prevState) => ({
      display_avg: !prevState.display_avg
    }));
  }

  render() {
    const { Filter } = this.strategy
    const { filters } = this.state

    console.log(filters)

    if (!filters) return null

    const filtersNames = filters.items.revenue.values.map((values, index) => (
      <div className="col-md-1" key={index}><p>{values.item.name}</p></div>
    ))

    const revenue = filters.items.revenue.values.map((values, index) => (
      <div className="col-md-1" key={index}><p>{values.value}</p></div>
    ))

    const cost = filters.items.cost.values.map((values, index) => (
      <div className="col-md-1" key={index}><p>{values.value}</p></div>
    ))

    const profit = filters.profit.values.map((profit, index) => (
      <div className="col-md-1" key={index}><p>{profit.value}</p></div>
    ))

    return(
      <div className='row'>
          <div className='col-md-12 reports-filter'>
            <Filter />
            <div className="pull-right">
              <input type="checkbox" id="totalbtn" onClick={this.totalPrint.bind(this)}/>
              <label for="totalbtn">Total</label>
              <input type="checkbox" id="avgbtn" className='avg' onClick={this.avgPrint.bind(this)} />
              <label for="avgbtn">AVG</label>
            </div>
          </div>

          <div className={`col-md-offset-2 ${this.fetchClassName(this.state.display_total, this.state.display_avg)}`}>
            <div className="col-md-12">
              {filtersNames}
            </div>
          </div>
          <div className={!this.state.display_total ? 'display_none' : 'col-md-1'}>
            <b>Total</b>
          </div>
          <div className={!this.state.display_avg ? 'display_none' : 'col-md-1'}>
            <b>AVG</b>
          </div>
          <div className="clearfix"></div>

          <div className="col-md-2 revenue"><p>Revenue:</p></div>
          <div className={this.fetchClassName(this.state.display_total, this.state.display_avg)}>
            <div className="col-md-12">
              {revenue}
            </div>
          </div>
          <div className={this.state.display_avg ? 'col-md-1 pull-right' : 'displayNone'}>
            <b>{filters.average.revenue}</b>
          </div>
          <div className={this.state.display_total ? 'col-md-1 pull-right' : 'displayNone'}>
            <b>{filters.total.revenue}</b>
          </div>
          <ArticlesList
            filters = {filters}
            type = {filters.items.revenue}
            displayTotal={this.state.display_total}
            displayAvg={this.state.display_avg}
            fetchClassName = {this.fetchClassName.bind(this)}
          />
          <div className="clearfix"></div>

          <div className="col-md-2"><p>Cost:</p></div>
          <div className={this.fetchClassName(this.state.display_total, this.state.display_avg)}>
            <div className="col-md-12">
              {cost}
            </div>
          </div>
          <div className={this.state.display_avg ? 'col-md-1 pull-right' : 'displayNone'}>
            <b>{filters.average.cost}</b>
          </div>
          <div className={this.state.display_total ? 'col-md-1 pull-right' : 'displayNone'}>
            <b>{filters.total.cost}</b>
          </div>
          <ArticlesList
            filters = {filters}
            type = {filters.items.cost}
            displayTotal={this.state.display_total}
            displayAvg={this.state.display_avg}
            fetchClassName = {this.fetchClassName.bind(this)}
          />
          <div className="clearfix"></div>

          <div className="col-md-2"><p>Profit:</p></div>
          <div className={this.fetchClassName(this.state.display_total, this.state.display_avg)}>
            <div className="col-md-12">
              {profit}
            </div>
          </div>
          <div className={this.state.display_avg ? 'col-md-1 pull-right' : 'displayNone'}>
            <b>{filters.average.profit}</b>
          </div>
          <div className={this.state.display_total ? 'col-md-1 pull-right' : 'displayNone'}>
            <b>{filters.total.profit}</b>
          </div>
      </div>
    )
  }
}
