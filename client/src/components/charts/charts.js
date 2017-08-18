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
import { HighchartsChart, Chart, XAxis, YAxis, Title, Legend, ColumnSeries, SplineSeries, PieSeries, Tooltip} from 'react-jsx-highcharts';

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
    let YearNow = new Date().getFullYear()
    let array = []

    for (var i = 12 - 1; i >= 0; i--) {
      array[i] = 0
    }

    return {
      allDateForFilter: [],
      currentYear: YearNow,
      chartsData: {
        Revenue: Object.assign([], array),
        Cost: Object.assign([], array),
        Profit: Object.assign([], array)
      }
    }
  }

  createReportState() {
    const { registers, articles } = this.props
    const { currentYear } = this.state
    this.state = this.createInitialState()

    let chartsData = Object.assign([], this.state.chartsData);
    let allDateForFilter =[]

    registers.forEach(register => {
      let dataNow = new Date(register.date)
      const registerYear = dataNow.getFullYear()
      pushUnique(allDateForFilter, registerYear)

      if (!(registerYear === currentYear /*&& current.month.includes(registerMonth)*/)) return
        let modelMoun = monthsNames[dataNow.getMonth()]
        let numModelMoun = dataNow.getMonth()
        const article = articles.find(article => article.id === register.article_id)
        let modelTypeArticle = article.type

        chartsData[modelTypeArticle][numModelMoun] += register.value
        chartsData['Profit'][numModelMoun] = chartsData['Revenue'][numModelMoun] - chartsData['Cost'][numModelMoun]
    })

    this.setState({
      allDateForFilter,
      chartsData: chartsData
    });
  }

 handleYearChange = e => {
    if (this.state.isError) return

    const year = e.value

    setStatePromise(this, (prevState => ({
      currentYear: year
    }))).then(() => this.createReportState())
  }

  render() {
    let {Revenue, Cost, Profit} = this.state.chartsData

    return(
      <div>
        <div className='row'>
          <div className='col-md-2 select_year'>
            <Select
              name='years'
              className='reports-filter-select'
              onChange={this.handleYearChange.bind(this)}
              options={this.state.allDateForFilter.map(year => ({ value: year, label: year.toString() }))}
              value={this.state.currentYear}
            />
          </div>
        </div>

        <br />
        <br />
        <br />

        <HighchartsChart>
          <Tooltip pointFormat={ColumnSeries.data} shared={true} useHTML={true}/>
          <Chart />
          <Legend />
          <XAxis id="x" categories={monthsNames} title={{text:'Місяць'}}/>
          <YAxis id="number" title={{text:'Сума'}}>
            <ColumnSeries id="revenue" name="Revenue" data={Revenue} color="#32CD32"/>
            <ColumnSeries id="cost" name="Cost" data={Cost} color="#F62817"/>
            <ColumnSeries id="profit" name="Profit" data={Profit} color="#008080"/>
          </YAxis>
        </HighchartsChart>
      </div>
    );
  };
}
