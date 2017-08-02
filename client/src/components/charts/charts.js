import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import Select                             from 'react-select'
import ArticlesList                       from '../reports/articlesList'
import { actions as counterpartyActions } from '../../resources/counterparties';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import { actions as workspaceActions }    from '../../actions/workspaces'
import { toaster }                        from '../../actions/alerts';
import moment                             from 'moment';
import { setStatePromise, pushUnique }    from '../../utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const monthsNames = moment.monthsShort();

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
    let chartsData = []

    for (var i = monthsNames.length - 1; i >= 0; i--) {
      chartsData.unshift(
        {
          name: monthsNames[i],
          Revenue: 0,
          Cost: 0,
          Profit: 0
        }
      );
    }

    return {
      currentYear: 2017,
      chartsData: chartsData
    }
  }

  createReportState() {
    const { registers, articles } = this.props
    const { currentYear } = this.state
    let chartsData = Object.assign([], this.state.chartsData);

    for (var i = registers.length - 1; i >= 0; i--) {
      let register = registers[i]
      let dataNow = new Date(register.date)

      if (currentYear === dataNow.getFullYear()) {
        const article = articles.find(article => article.id === register.article_id)
        let modelTypeArticle = article.type
        let modelMoun = monthsNames[dataNow.getMonth()]

        for (var j = chartsData.length - 1; j >= 0; j--) {
          if (chartsData[j].name === modelMoun) {
            chartsData[j][modelTypeArticle] += register.value
            chartsData[j].Profit = chartsData[j].Revenue - chartsData[j].Cost
          }
        }
      }
    }

    this.setState({
      chartsData: chartsData
    });
  }

  render() {
    return(
      <div>
        <h3>Charts</h3>
          <BarChart width={900} height={450} data={this.state.chartsData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Legend />
            <Bar dataKey="Revenue" fill="#8884d8" />
            <Bar dataKey="Cost" fill="#82ca9d" />
            <Bar dataKey="Profit" fill="Orange" />
          </BarChart>
      </div>
    );
  };
}
