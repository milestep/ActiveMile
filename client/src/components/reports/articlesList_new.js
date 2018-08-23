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
import                                         '../../styles/reports/checkbox.css'

import { index as fetchReports }          from '../../actions/reports'
import moment from 'moment';
// import FilterMonth from './filter_new'

@connect(state => ({
  registers: state.registers.items,
  articles: state.articles.items,
  filterYears: state.registers.years,
  counterparties: state.counterparties.rest.items,
  nextWorkspace: state.workspaces.app.next,
  reports: state.reports.items,
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
    //
    fetchReports,
    toaster,
  }, dispatch)
}))

export default class TestNEW extends Component {
  constructor(props) {
    super(props);

    let monthNames = moment.monthsShort()

    this.state = {
      showContent: false,
      displayAvg: false,
      displayTotal: false,
      openedArticles: [],
      registers_list: [],
      month: monthNames
    }

    this.toggleContent = this.toggleContent.bind(this)

  }

  componentDidMount() {
    this.fetchReports()
  }

  fetchReports() {
    const { actions } = this.props;
    actions.fetchReports()
  }

  toggleContent(event) {
    event.preventDefault()
    const {showContent} = this.state
    this.setState({
      showContent: !showContent
    })
  }

  render() {
    if (!this.props.reports.reports) return null
    let monthNames = moment.monthsShort()
    let date = new Date()
    let currentMonth = date.getMonth()
    let current = this.state.month.filter((month, index) => index == currentMonth)
    console.log('current_month: ', current)


    return(
      <div className="col-md-12">
        <div className="fake-panel">
          <div className="reports-list-heading">
            <div className="col-md-2"><p>Revenue:</p></div>
            <div className="col-md-1"><b className="blue">{this.props.reports.sum.Revenue}</b></div>
          </div>
        </div>

        <div className="clearfix"></div>
        {/* {monthNames.map((month, index) => {
          if (current == currentMonth)
            return(
              <div key={index}>
                {console.log("++++", currentMonth)}
              </div>
            );
        })} */}

                {this.props.reports.reports['Revenue'].map((report, index) => {

                  return (
                    <div key={index} className="panel panel-default">
                      <div class="panel-heading clearfix">
                        <div className="col-md-1"><p>{report.article.title}</p></div>
                        <div className="col-md-1">
                          <button onClick={this.toggleContent} className="btn btn-default btn-xs">
                            <i className={`fa fa-angle-${this.state.showContent ? "up" : "down"}`}></i>
                          </button>
                        </div>

                        <div className="col-md-1"><p>{report.value}</p></div>
                      </div>
                      {this.state.showContent &&
                        <div className="panel-body">
                          {report.counterparties.map((counterparty, index) => {
                            if(counterparty.counterparty)
                              return(
                                <div key={index} className="row">
                                  <div className="col-md-2"><p>{counterparty.counterparty.name}</p></div>
                                  <div className="col-md-1"><p>{counterparty.value}</p></div>
                                </div>
                              );
                            else
                              return(
                                <div key={index} className="row">
                                  <div className="col-md-2"> — </div>
                                  <div className="col-md-1"><p>{counterparty.value}</p></div>
                                </div>
                              );
                          })}
                        </div>
                      }
                    </div>
                  );
                  })}

      <div className="fake-panel">
        <div className="reports-list-heading">
          <div className="col-md-2"><p>Cost:</p></div>
          <div className="col-md-1"><b className="red">{this.props.reports.sum.Cost}</b></div>
        </div>
      </div>

      <div className="clearfix"></div>

      {this.props.reports.reports['Cost'].map((report, index) => {
          return (
            <div key={index} className="panel panel-default">
              <div class="panel-heading clearfix">
                <div className="col-md-1"><p>{report.article.title}</p></div>
                <div className="col-md-1">
                  <button onClick={this.toggleContent.bind(this)} className="btn btn-default btn-xs">
                    <i className={`fa fa-angle-${this.state.showContent ? "up" : "down"}`}></i>
                  </button>
                </div>

                <div className="col-md-1"><p>{report.value}</p></div>
              </div>

              {this.state.showContent &&
                <div className="panel-body">
                  {report.counterparties.map((counterparty, index) => {
                    if(counterparty.counterparty)
                      return(
                        <div key={index} className="row">
                          <div className="col-md-2"><p>{counterparty.counterparty.name}</p></div>
                          <div className="col-md-1"><p>{counterparty.value}</p></div>
                        </div>
                      );
                    else
                      return(
                        <div key={index} className="row">
                          <div className="col-md-2"> — </div>
                          <div className="col-md-1"><p>{counterparty.value}</p></div>
                        </div>
                      );

                  })}
                </div>
              }
            </div>

          );

        })}


        <div className="fake-panel row">
          <div className="reports-list-heading">
            <div className="col-md-2 revenue"><b>Profit:</b></div>
            <div className="col-md-2"><b className="green">{this.props.reports.result}</b></div>
          </div>
        </div>
     </div>

    );
  }

}

