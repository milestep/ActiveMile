import React, { Component, PropTypes }    from 'react'
import { bindActionCreators }             from 'redux'
import { connect }                        from 'react-redux'
import Select                             from 'react-select'
import { toaster }                        from '../../actions/alerts';
import { actions as subscriptionActions } from '../../actions/subscriptions'
import { actions as workspaceActions }    from '../../actions/workspaces'
import { setStatePromise, pushUnique }    from '../../utils'
import ArticlesList                       from './articlesList'
import MonthsTabs                         from './monthsTabs'
import moment                             from 'moment';

const monthsNames = moment.monthsShort()

@connect(state => ({
  registers: state.registers.items,
  articles: state.articles.items,
  counterparties: state.counterparties.items,
  nextWorkspace: state.workspaces.app.next,
  isResolved: {
    registers: state.subscriptions.registers.resolved,
    articles: state.subscriptions.articles.resolved,
    counterparties: state.subscriptions.counterparties.resolved
  }
}), dispatch => ({
  actions: bindActionCreators({
    ...subscriptionActions,
    ...workspaceActions,
    toaster
  }, dispatch)
}))
export default class Reports extends Component {
  static propTypes = {
    registers: PropTypes.array.isRequired,
    articles: PropTypes.array.isRequired,
    counterparties: PropTypes.array.isRequired,
    nextWorkspace: PropTypes.object.isRequired,
    isResolved: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.types = ['Revenue', 'Cost']
    this.subscriptions = ['registers', 'articles', 'counterparties']
    this.toaster = props.actions.toaster()
    this.state = this.createInitialState()
  }

  componentWillMount() {
    this.props.actions.subscribe(this.subscriptions)
      .then(() => {
        if (this.props.registers.length === 0) {
          this.toaster.warning('There is no data for reports')
        }
        this.createReportState()
      })
      .catch(err => this.handleSubscriptionsError(err))
  }

  componentWillReceiveProps() {
    if (this.isNextWorkspaceChanged()) {
      this.createReportState()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isStateReady || nextState.isError) return true
    if (this.isNextWorkspaceChanged()) return true
    return false
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions)
  }

  isNextWorkspaceChanged() {
    return this.props.actions.isNextWorkspaceChanged(this.props.nextWorkspace.id)
  }

  createInitialState() {
    const date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth()

    return {
      isError: false,
      isStateReady: false,
      current: { year, month: [month] },
      report: {
        Revenue: {},
        Cost: {}
      },
      available: {
        years: [ year ],
        months: []
      },
      profit: {
        common: {},
        Revenue: {},
        Cost: {}
      },
      collapsedArticles: {
        Revenue: [],
        Cost: []
      },
    }
  }

  createReportState() {
    const fakeState = this.createInitialState()
    const { registers, articles } = this.props
    const { current } = this.state

    let { report, profit } = fakeState
    let { years, months } = fakeState.available

    const currentTitlesMonths = []
    current.month.forEach(numMonth => currentTitlesMonths[monthsNames[numMonth]] = 0)

    for(let model in profit) {
      profit[model] =  Object.assign({}, currentTitlesMonths)
    }

    registers.forEach(register => {
      const registerDate = new Date(register.date),
            registerYear = registerDate.getFullYear(),
            registerMonth = registerDate.getMonth()

      pushUnique(years, registerYear)
      if (registerYear === current.year)
        pushUnique(months, registerMonth)

      if (!(registerYear === current.year && current.month.includes(registerMonth))) return

      const article = Object.assign({}, articles.find(article => article.id === register.article_id))
      const reportType = report[article.type]
      const articleTitle = article.title
      let fakeCurrentTitlesMonths = Object.assign({}, currentTitlesMonths)
      let counterpartyName = this.findRegisterCounterparty(register)

      profit[article.type][monthsNames[registerMonth]] += register.value
      profit['common'][monthsNames[registerMonth]] += this.getRegisterValue(article.type, register.value)

      if (reportType[articleTitle]) {
        if (reportType[articleTitle]['counterparties'][counterpartyName]) {
          reportType[articleTitle]['counterparties'][counterpartyName][monthsNames[registerMonth]] += register.value
        } else {
          fakeCurrentTitlesMonths[monthsNames[registerMonth]] = register.value
          reportType[articleTitle]['counterparties'][counterpartyName] = fakeCurrentTitlesMonths
        }
      } else {
        reportType[articleTitle] = {}
        reportType[articleTitle]["counterparties"] = {}
        fakeCurrentTitlesMonths[monthsNames[registerMonth]] = register.value
        reportType[articleTitle]["counterparties"][counterpartyName] = fakeCurrentTitlesMonths
      }
    })

    for(let model in report) {
      for(let articleTitle in report[model]) {
        report[model][articleTitle]['values'] = Object.assign({}, currentTitlesMonths)

        for(let counterpartyName in report[model][articleTitle]['counterparties']) {
          for(let month in report[model][articleTitle]['counterparties'][counterpartyName]) {
            report[model][articleTitle]['values'][month] += report[model][articleTitle]['counterparties'][counterpartyName][month]
          }
        }
      }
    }

    this.setState((prevState) => ({
      ...prevState,
      report,
      profit,
      isStateReady: true,
      available: {
        years: years.sort((a, b) => b - a),
        months: months.sort()
      }
    }))
  }

  findRegisterCounterparty(register) {
    const { counterparties } = this.props
    let counterpartyName =  register.counterparty_id ? counterparties
        .find(counterparty => counterparty.id === register.counterparty_id) : { name: '-' }

    return counterpartyName.name
  }

  getRegisterValue(type, value) {
    return type == 'Cost' ? -value : value
  }

  handleSubscriptionsError(error) {
    const { available } = this.createInitialState()

    this.setState((prevState) => ({
      ...prevState,
      isError: true,
      isStateReady: false,
      available
    }))
  }

  handleYearChange = e => {
    if (this.state.isError) return

    const year = e.value

    setStatePromise(this, (prevState => ({
      current: {
        ...prevState.current, year
      }
    }))).then(() => this.createReportState())
  }

  handleMonthChange = month => {
    if (this.state.isError) return
    let currentMonths = Object.assign([], this.state.current.month)
    let index = currentMonths.indexOf(month)

    if (index != -1)
      currentMonths.splice([index], 1)
    else
      currentMonths.push(month)

    setStatePromise(this, (prevState => ({
      current: {
        ...prevState.current, month: currentMonths.sort((a, b) => a - b)
      }
    }))).then(() => this.createReportState())
  }

  handleArticleChange = (id, type) => {
    if (this.state.isError) return

    this.setState((prevState) => {
      const { collapsedArticles } = prevState
      const index = collapsedArticles[type].indexOf(id)
      let newCollapsedArticles = collapsedArticles[type].slice()

      if (index > -1) {
        newCollapsedArticles.splice(index, 1)
      } else {
        newCollapsedArticles.push(id)
      }

      return { collapsedArticles: {
        ...collapsedArticles,
        [type]: newCollapsedArticles
      } }
    })
  }

  printCurrentMonths() {
    const { current } = this.state

    const monthsNames = moment.monthsShort()
    let printCurrentMonths = [];

    monthsNames.forEach((month, index) => {
      const isCurrent = current.month.includes(monthsNames.indexOf(month))

      if (isCurrent) {
        printCurrentMonths.push(
          <div className='col-md-1' key={month}>
            { month }
          </div>
        )
      }
    });

    return printCurrentMonths
  }

  profitValues(months) {
    let res = [];

    for(let month in months) {
      res.push( <div key={month} className={'col-md-1'}>{ months[month] }</div> )
    }

    return res
  }

  render() {
    const { report, profit, current, available, collapsedArticles } = this.state

    if (!this.state.isStateReady && !this.state.isError) {
      return(
        <span className='spin-wrap main-loader'>
          <i class='fa fa-spinner fa-spin fa-3x'></i>
        </span>
      )
    }

    return(
      <div>
        <div className='row'>
          <div className='col-md-12 reports-filter'>
            <Select
              name='years'
              className='reports-filter-select'
              onChange={this.handleYearChange.bind(this)}
              options={available.years.map(year => ({ value: year, label: year.toString() }))}
              value={current.year}
            />
            <MonthsTabs
              current={current.month}
              available={available.months}
              handleMonthChange={this.handleMonthChange.bind(this)}
            />
          </div>
        </div>

        <div className='reports-list'>
          <div className='row'>
            <div className='col-md-2'></div>
            <div className='col-md-10 reports-list-align-right'>
              <div className='reports-list-months'>
                {this.printCurrentMonths()}
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12'>
              <div className='row reports-list-heading'>
                <h4 className='col-md-2 reports-list-title'>Revenue</h4>
                <div className='col-md-10 reports-list-value reports-list-align-right'>
                  { this.profitValues(profit['Revenue']) }
                </div>
              </div>

              <hr className='reports-list-separator' />

              <ArticlesList
                currentMonths={current.month}
                type='Revenue'
                articles={report['Revenue']}
                collapsedArticles={collapsedArticles['Revenue']}
                handleArticleChange={this.handleArticleChange.bind(this)}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12'>
              <div className='row reports-list-heading'>
                <h4 className='col-md-2 reports-list-title'>Cost</h4>
                <div className='col-md-10 reports-list-value reports-list-align-right'>
                  { this.profitValues(profit['Cost']) }
                </div>
              </div>

              <hr className='reports-list-separator' />

              <ArticlesList
                currentMonths={current.month}
                type='Cost'
                articles={report['Cost']}
                collapsedArticles={collapsedArticles['Cost']}
                handleArticleChange={this.handleArticleChange.bind(this)}
              />
            </div>
          </div>

          <div className='row'>
            <div className='col-md-12'>
              <div className='row reports-list-heading profit'>
                <h4 className='col-md-2 reports-list-title'>Profit</h4>
                <div className='col-md-10 reports-list-value reports-list-align-right'>
                  { this.profitValues(profit['common']) }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
