import React, {Component}                 from 'react';
import {bindActionCreators}               from 'redux';
import {connect}                          from 'react-redux';
import Select                             from 'react-select'
import {actions as subscriptionActions}   from '../../actions/subscriptions';
import {actions as workspaceActions}      from '../../actions/workspaces'
import {index as fetchRegisters}          from '../../actions/registers'
import {toaster}                          from '../../actions/alerts';
import moment                             from 'moment';
import {setStatePromise, defaultMonths}   from '../../utils'
import {
  HighchartsChart,
  Chart,
  XAxis,
  YAxis,
  Title,
  Legend,
  ColumnSeries,
  SplineSeries,
  PieSeries,
  Tooltip
} from 'react-jsx-highcharts';
const monthsNames = moment.monthsShort();
@connect(
  state => ({
    articles: state.articles.items,
    registers: state.registers.items,
    filter_years: state.registers.years,
    nextWorkspace: state.workspaces.app.next,
    isResolved: {
      registers: state.subscriptions.registers.resolved
    }
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...subscriptionActions,
      ...workspaceActions,
      toaster,
      fetchRegisters
    }, dispatch)
  })
)
export default class Charts extends Component {
  constructor(props) {
    super(props);
    this.types = ['Revenue', 'Cost'],
    this.toaster = props.actions.toaster();
    this.subscriptions = ['articles'],
    this.state = this.createInitialState()
  }

  componentWillMount() {
    this.props.actions.subscribe(this.subscriptions)
      .then(() => {
        this.props.actions.fetchRegisters({year: this.state.currentYear, month: defaultMonths()})
          .then(() => {
            if (!this.props.registers.length) {
              this.toaster.warning('There is no data for charts')
            }
            this.createReportState()
          })
      })
  }

  componentWillReceiveProps() {
    if (this.isNextWorkspaceChanged()) {
      this.props.actions.fetchRegisters({year: this.state.currentYear, month: defaultMonths()})
        .then(() => {
          this.createReportState()
        })
    }
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions)
  }

  isNextWorkspaceChanged() {
    return this.props.actions.isNextWorkspaceChanged(this.props.nextWorkspace.id)
  }

  createInitialState() {
    let currentYear = new Date().getFullYear()
    let initData = new Array(12)
    initData.fill(0)
    return {
      currentYear: currentYear,
      chartsData: {
        Revenue: Object.assign([], initData),
        Cost: Object.assign([], initData),
        Profit: Object.assign([], initData)
      }
    }
  }

  createReportState() {
    const {registers, articles} = this.props
    const {currentYear} = this.state
    this.state = this.createInitialState()
    let chartsData = Object.assign([], this.state.chartsData);
    registers.forEach(register => {
      let dataNow = new Date(register.date)
      let modelMoun = monthsNames[dataNow.getMonth()]
      let numModelMoun = dataNow.getMonth()
      const article = articles.find(article => article.id === register.article_id)
      let modelTypeArticle = article.type
      chartsData[modelTypeArticle][numModelMoun] += register.value
      chartsData['Profit'][numModelMoun] = chartsData['Revenue'][numModelMoun] - chartsData['Cost'][numModelMoun]
    })
    this.setState({
      currentYear,
      chartsData: chartsData
    });
  }

  handleYearChange = e => {
    if (this.state.isError) return
    const year = e.value

    setStatePromise(this, (prevState => ({
      currentYear: year
    }))).then(() => {
      this.props.actions.fetchRegisters({year: year, month: defaultMonths()})
        .then(() => {
          if (!this.props.registers.length) {
            this.toaster.warning('There is no data for charts')
          }
          this.createReportState()
        })
    })
  }

  render() {
    let {Revenue, Cost, Profit} = this.state.chartsData
    return (
      <div>
        <div className='row'>
          <div className='col-md-2 select_year'>
            <Select
              name='years'
              className='reports-filter-select'
              onChange={this.handleYearChange.bind(this)}
              options={this.props.filter_years.map(year => ({value: year, label: year.toString()}))}
              value={this.state.currentYear}
            />
          </div>
        </div>
        <div className="chart_views">
          <HighchartsChart>
            <Tooltip pointFormat={ColumnSeries.data} shared={true} useHTML={true}/>
            <Chart />
            <Legend />
            <XAxis id="x" categories={monthsNames} title={{text: 'Місяць'}}/>
            <YAxis id="number" title={{text: 'Сума'}}>
              <ColumnSeries id="revenue" name="Revenue" data={Revenue} color="#32CD32"/>
              <ColumnSeries id="cost" name="Cost" data={Cost} color="#F62817"/>
              <ColumnSeries id="profit" name="Profit" data={Profit} color="#008080"/>
            </YAxis>
          </HighchartsChart>
        </div>
      </div>
    );
  };
}
