import React, { Component, PropTypes }    from 'react'
import { bindActionCreators }             from 'redux'
import { connect }                        from 'react-redux'
import Select                             from 'react-select'
import { toaster }                        from '../../actions/alerts';
import { actions as subscriptionActions } from '../../actions/subscriptions'
import { setStatePromise, pushUnique }    from '../../utils'
import ArticlesList                       from './articlesList'
import MonthsTabs                         from './monthsTabs'

@connect(state => ({
  registers: state.registers.items,
  articles: state.articles.items,
  counterparties: state.counterparties.items,
  isResolved: {
    registers: state.subscriptions.registers.resolved,
    articles: state.subscriptions.articles.resolved,
    counterparties: state.subscriptions.counterparties.resolved
  }
}), dispatch => ({
  actions: bindActionCreators({
    ...subscriptionActions, toaster
  }, dispatch)
}))
export default class Reports extends Component {
  static propTypes = {
    registers: PropTypes.array.isRequired,
    articles: PropTypes.array.isRequired,
    counterparties: PropTypes.array.isRequired,
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

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.isStateReady || nextState.isError
  }

  createInitialState() {
    const date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth()

    return {
      profit: 0,
      isError: false,
      isStateReady: false,
      current: { year, month, article: null },
      available: { years: [], months: [] },
      report: { Revenue: [], Cost: [] }
    }
  }

  createReportState() {
    const { registers, articles } = this.props
    const { current } = this.state

    let reportState = { Revenue: [], Cost: [] }
    let years = [ new Date().getFullYear() ]
    let months = []
    let profit = 0

    registers.forEach(register => {
      const registerDate = new Date(register.date),
            registerYear = registerDate.getFullYear(),
            registerMonth = registerDate.getMonth()

      pushUnique(years, registerYear)
      if (registerYear === current.year)
        pushUnique(months, registerMonth)

      if (!(registerYear === current.year && registerMonth === current.month)) return

      const article = Object.assign({}, articles.find(article => article.id === register.article_id))
      const reportType = reportState[article.type]

      let reportArticle = reportType.length ?
          reportType.find(article => article.id === register.article_id) : null

      profit += this.getRegisterValue(article.type, register.value)

      if (reportArticle) {
        Object.assign(
          reportArticle,
          this.getArticleCounterparties(register, reportArticle)
        )
      } else {
        reportType.push({
          ...article,
          ...this.getEmptyArticleCounterparties(register, article)
        })
      }
    })

    this.setState((prevState) => ({
      ...prevState,
      report: reportState,
      isStateReady: true,
      profit,
      available: {
        years: years.sort((a, b) => b - a),
        months: months.sort()
      }
    }))
  }

  getArticleCounterparties(register, article) {
    const registerValue = this.getRegisterValue(article.type, register.value)
    let articleCounterparties = (article.counterparties).slice()
    let registerCounterparty = this.findRegisterCounterparty(register)

    for (let i = 0; i < articleCounterparties.length; i++) {
      let counterparty = articleCounterparties[i]

      if (registerCounterparty.id !== counterparty.id) continue

      counterparty.value = registerValue + counterparty.value

      return {
        value: article.value + registerValue,
        counterparties: articleCounterparties
      }
    }

    articleCounterparties.push({
      ...registerCounterparty,
      value: registerValue
    })

    return {
      value: article.value + registerValue,
      counterparties: articleCounterparties
    }
  }

  getEmptyArticleCounterparties(register, article) {
    const registerValue = this.getRegisterValue(article.type, register.value)
    let registerCounterparty = this.findRegisterCounterparty(register)

    return {
      value: registerValue,
      counterparties: [
        Object.assign({}, registerCounterparty, { value: registerValue })
      ]
    }
  }

  findRegisterCounterparty(register) {
    const { counterparties } = this.props

    return register.counterparty_id ? counterparties
        .find(counterparty => counterparty.id === register.counterparty_id) : { id: 0 }
  }

  getRegisterValue(type, value) {
    return type == 'Cost' ? -value : value
  }

  handleSubscriptionsError(error) {
    this.setState((prevState) => ({
      ...prevState,
      isError: true,
      isStateReady: false,
      available: {
        years: [ new Date().getFullYear() ],
        months: []
      }
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

    setStatePromise(this, (prevState => ({
      current: {
        ...prevState.current, month
      }
    }))).then(() => this.createReportState())
  }

  handleArticleChange = id => e => {
    if (this.state.isError) return

    const { current } = this.state

    this.setState((prevState) => ({
      current: {
        ...prevState.current,
        article: id !== current.article ? id : null
      }
    }))
  }

  render() {
    const { report, profit, current, available } = this.state

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

        <div className='row'>
          <div className='col-md-2'><h3>Total:</h3></div>
          <div className='col-md-10'>
            <h3 className={profit > 0 ? 'color-green' : 'color-red'}>{profit}</h3>
          </div>
        </div>

        <hr />

         <div className='row'>
          <div className='col-md-6'>
            <h4>Revenue</h4>
            <ArticlesList
              type='Revenue'
              articles={report['Revenue']}
              current={current.article}
              handleArticleChange={this.handleArticleChange.bind(this)}
            />
          </div>
          <div className='col-md-6'>
            <h4>Cost</h4>
            <ArticlesList
              type='Cost'
              articles={report['Cost']}
              current={current.article}
              handleArticleChange={this.handleArticleChange.bind(this)}
            />
          </div>
        </div>
      </div>
    )
  }
}
