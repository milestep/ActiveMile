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

    this.types = ['Revenue', 'Cost']
    this.subscriptions = ['articles', 'counterparties']
    this.strategy = this.setStrategy()
    this.toaster = props.actions.toaster()
    this.stateCreator = new ReportsStateCreator(this.strategy)

    this.state = {
      filters: this.stateCreator.getInitialState(),
      displayAvg: false,
      displayTotal: false,
      openedArticles: []
    }
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

    this.setState({
      filters: this.stateCreator.generateState({
        registers, articles, counterparties
      })
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
      displayTotal: !prevState.displayTotal
    }));
  }

  avgPrint() {
    this.setState((prevState) => ({
      displayAvg: !prevState.displayAvg
    }));
  }

  toggleArticle(id) {
    // const { openedArticles } = this.state
    var newArticles = _.clone(this.state.openedArticles)
    const index = newArticles.indexOf(id)

    if (index > -1) {
        newArticles.splice(index, 1)
      } else {
        newArticles.push(id)
      }

    this.setState({
      openedArticles: newArticles
    })
  }

  render() {
    const { Filter } = this.strategy
    const { filters } = this.state
    const appliedFilters = this.strategy.getPrimaryAppliedFilters()

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

    const filtersNamesTable = filters.items.revenue.values.map((values, index)=>{
      return(<th key={index}>{values.item.name}</th>)
    })
    const revenueTable = filters.items.revenue.values.map((values, index) => {
      return(<td key={index}>{values.value}</td>)
    })
    const costTable = filters.items.cost.values.map((values, index) => {
      return(<td key={index}>{values.value}</td>)
    })
    const commonTable = filters.profit.values.map((profit, index) => {
      return(<td key={index}>{profit.value}</td>)
    })
    console.log(appliedFilters)

    return(
      <div className='row'>
        <div>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-xls-button pull-right"
            table="table-to-xls"
            filename="tablexls"
            sheet="tablexls"
            buttonText="Download as XLS"/>
            <table id="table-to-xls" className='display_none'>
              <tr>
                <th>Month Names</th>
                <th></th>
                {filtersNamesTable}
              </tr>
              <tr>
                <td>Revenue</td>
                <td> {revenueTable}</td>
              </tr>
              <tr>
                <td>Cost</td>
                <td> {costTable}</td>
              </tr>
              <tr>
                <td>Profit</td>
                <td>{commonTable}</td>
              </tr>
            </table>
          </div>

        <div className="reports-filter">
          <Filter />
        </div>

        <div className="pull-right col-md-2">
          <input type="checkbox" id="totalbtn" onClick={this.totalPrint.bind(this)}/>
          <label for="totalbtn">Total</label>
          <input type="checkbox" id="avgbtn" className='avg' onClick={this.avgPrint.bind(this)} />
          <label for="avgbtn">AVG</label>
        </div>

        <div className="col-md-12">
          <div className="fake-panel">
            <div className="row reports-list-heading">
              <div className={`col-md-offset-2 ${this.fetchClassName(this.state.displayTotal, this.state.displayAvg)}`}>
                {filtersNames}
              </div>
              <div className={this.state.displayTotal ? 'col-md-1' : 'display_none'}>
                <b>Total</b>
              </div>
              <div className={this.state.displayAvg ? 'col-md-1' : 'display_none'}>
                <b>AVG</b>
              </div>
              <div className="clearfix"></div>
              <div className="col-md-2 revenue"><p>Revenue:</p></div>
              <div className={this.fetchClassName(this.state.displayTotal, this.state.displayAvg)}>
                {_.isEmpty(appliedFilters) ? 0 : revenue}
              </div>
              <div className={this.state.displayAvg ? 'col-md-1 pull-right' : 'display_none'}>
                <b>{filters.average.revenue}</b>
              </div>
              <div className={this.state.displayTotal ? 'col-md-1 pull-right' : 'display_none'}>
                <b>{filters.total.revenue}</b>
              </div>
            </div>
          </div>

          <ArticlesList
            filters = {filters}
            type = {filters.items.revenue}
            toggleArticle = {this.toggleArticle.bind(this)}
            openedArticles = {this.state.openedArticles}
            appliedFilters = {appliedFilters}
            displayTotal={this.state.displayTotal}
            displayAvg={this.state.displayAvg}
            fetchClassName = {this.fetchClassName.bind(this)}
          />
          <div className="clearfix"></div>

          <div className="fake-panel">
            <div className="row reports-list-heading">
              <div className="col-md-2"><p>Cost:</p></div>
              <div className={this.fetchClassName(this.state.displayTotal, this.state.displayAvg)}>
                {_.isEmpty(appliedFilters) ? 0 : cost}
              </div>
              <div className={this.state.displayAvg ? 'col-md-1 pull-right' : 'display_none'}>
                <b>{filters.average.cost}</b>
              </div>
              <div className={this.state.displayTotal ? 'col-md-1 pull-right' : 'display_none'}>
                <b>{filters.total.cost}</b>
              </div>
            </div>
          </div>

          <ArticlesList
            filters = {filters}
            type = {filters.items.cost}
            toggleArticle = {this.toggleArticle.bind(this)}
            openedArticles = {this.state.openedArticles}
            appliedFilters = {appliedFilters}
            displayTotal={this.state.displayTotal}
            displayAvg={this.state.displayAvg}
            fetchClassName = {this.fetchClassName.bind(this)}
          />
          <div className="clearfix"></div>

          <div className="fake-panel">
            <div className="row reports-list-heading">
              <div className="col-md-2"><p>Profit:</p></div>
              <div className={this.fetchClassName(this.state.displayTotal, this.state.displayAvg)}>
                {_.isEmpty(appliedFilters) ? 0 : profit}
              </div>
              <div className={this.state.displayAvg ? 'col-md-1 pull-right' : 'display_none'}>
                <b>{filters.average.profit}</b>
              </div>
              <div className={this.state.displayTotal ? 'col-md-1 pull-right' : 'display_none'}>
                <b>{filters.total.profit}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
