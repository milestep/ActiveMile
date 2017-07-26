import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import Select                             from 'react-select'
import ArticlesList                       from '../reports/articlesList'
import { actions as counterpartyActions } from '../../resources/counterparties';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import { actions as workspaceActions }    from '../../actions/workspaces'
import { toaster }                        from '../../actions/alerts';
import {Bar as LineChart} from 'react-chartjs';
import { setStatePromise, pushUnique }    from '../../utils'
@connect(
  state => ({
    articles: state.articles.items,
    registers: state.registers.items,
    nextWorkspace: state.workspaces.app.next,
    isResolved: {
      registers: state.subscriptions.registers.resolved
    }
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...subscriptionActions,
      ...workspaceActions,
      toaster
    }, dispatch)
  })
)
export default class Charts extends Component {

  constructor(props) {
    super(props);
    this.types = ['Revenue', 'Cost'],
    this.toaster = props.actions.toaster();
    this.subscriptions = ['articles', 'registers'],
    this.state = this.createInitialState(),
    this.state = {
      chartData:{
      labels: ["January", "February", "March",
               "April", "May", "June",
               "July", "August", "September",
               "October", "November", "December"],
      datasets: [
         {
            label: "revenue",
            fillColor: "#32CD32",
            data: [3,7,4]
        },
        {
            label: "cost",
            fillColor: '#F62817',
            data: [4,3,5]
        },
        {
            label: "profit",
            fillColor: "#008080",
            data: [4,3,5]
        }
      ]
    }
  }
}

componentWillMount() {
    this.props.actions.subscribe(this.subscriptions)
      .then(() => {
        if (this.props.registers.length === 0) {
          this.toaster.warning('There is no data for reports')
        }
        console.log(this.props)
        this.createReportState()
      })
  }
  componentWillReceiveProps() {
    if (this.isNextWorkspaceChanged()) {
      this.createReportState()
    }
  }
  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions)
  }

  isNextWorkspaceChanged() {
    return this.props.actions.isNextWorkspaceChanged(this.props.nextWorkspace.id)
  }

  createInitialState() {
    const date = new Date(),
          year = date.getFullYear()

    return {
      isError: false,
      isStateReady: false,
      current: { year },
      report: {
        Revenue: [],
        Cost: []
      },
      available: {
        years: [ year ],
      },
      profit: {
        common: 0,
        Revenue: 0,
        Cost: 0
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
    let { years } = fakeState.available

    registers.forEach(register => {
      const registerDate = new Date(register.date),
            registerYear = registerDate.getFullYear()

      const article = Object.assign({}, articles.find(article => article.id === register.article_id))
      const reportType = report[article.type]

      let reportArticle = reportType.length ?
          reportType.find(article => article.id === register.article_id) : null

      profit.common += this.getRegisterValue(article.type, register.value)
      profit[article.type] += register.value

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
      report,
      profit,
      isStateReady: true,
      available: {
        years: years.sort((a, b) => b - a)
      }
    }))
  }
  render() {
    return(
      <div>
        <h3>Charts</h3>
          <LineChart data={this.state.chartData} options={null}  width="900" height="250"/>
      </div>
    );
  };
}
