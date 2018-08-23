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
import ArticlesListNEW                    from './articlesList_new'
import ArtNew from './art_new'
import                                         '../../styles/reports/checkbox.css'

import { index as fetchReports }          from '../../actions/reports'
import FilterMonth from './filter_new'


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

export default class reportNew extends Component {
  constructor(props) {
    super(props);
    this.toaster = props.actions.toaster()

    this.state = {
      displayAvg: false,
      displayTotal: false,
      openedArticles: [],
      registers_list: []
    }

  }

  componentDidMount() {
    this.fetchReports()
  }

  fetchReports() {
    const { actions } = this.props;
    actions.fetchReports()
  }
// index
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

  toggleArticle(id) {
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
    return(
      <div className="row">
          <div>
          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="btn btn-xls-button pull-right"
            table="table-to-xls"
            filename="tablexls"
            sheet="tablexls"
            buttonText="Download as XLS"/>
            <table id="table-to-xls" className='display_none'>
              <tbody>
                <tr>
                  <th>Month Names</th>
                </tr>
                <tr>
                  <td>Revenue</td>
                </tr>
                <tr>
                  <td>Cost</td>
                </tr>
                <tr>
                  <td>Profit</td>
                </tr>
              </tbody>
            </table>
        </div>

         <div className="clearfix"></div>
         <ArtNew />
      </div>
    );
  }

}

