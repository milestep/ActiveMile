import React, { Component, PropTypes }    from 'react'
import { bindActionCreators }             from 'redux'
import { connect }                        from 'react-redux'
import { toaster }                        from '../../actions/alerts'
import { actions as subscriptionActions } from '../../actions/subscriptions'
import { actions as workspaceActions }    from '../../actions/workspaces'
import { index as fetchRegisters }        from '../../actions/registers'
import { monthsStrategy, yearsStrategy }  from '../../strategies/reports'
import                                         '../../styles/reports/checkbox.css'

import { index as fetchReports }          from '../../actions/reports'
import moment from 'moment';

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

export default class ArtNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      month: {
          Jan:false,
          Feb:false,
          Mar:false,
          Apr:false,
          May:false,
          Jun:false,
          Jul:false,
          Aug:false,
          Sep:false,
          Oct:false,
          Nov:false,
          Dec:false,
      }
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

  monthClick(month) {
   this.setState({
     month: {
       ...this.state.month,
       [month]: !this.state.month[month]
     }
   })
   console.log("скотиняка: ", this.state.month[month])
  }



  render() {
    if (!this.props.reports.reports) return null

    const revenue = this.props.reports.reports["Revenue"];
    const cost = this.props.reports.reports["Cost"];

    const revData = [];
    for (const key in revenue) {
      if (revenue[key].length === 0) {
        // console.log("-----")
      } else {
        const rev = revenue[key].map((report, index) => {
          switch (report.date) {
            case 'Jan':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'Feb':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'Mar':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'Apr':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'May':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'Jun':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'Jul':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'Aug':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'Sep':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'Oct':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'Nov':
              console.log(report.article.title)
              console.log(report.value)
              break;
            case 'Dec':
              console.log(report.article.title)
              console.log(report.value)
              break;
          }
        })
      }
     }

    return (
      <div className="container">

        <div className="month-aug">
          <hr/>
          <p>AUG</p>
          <b className="blue">{this.props.reports.sum["Aug"]["Revenue"]}</b>

          {this.props.reports.reports["Revenue"]["Aug"].map((report, index) => {
            return(
              <div key={index}>
                <li>{report.article.title}</li>
                <li>{report.value}</li>

                {report.counterparties.map((counterparty, index) => {
                  if (counterparty.counterparty) {
                    return(
                      <ul style={{listStyleType: "none"}} key={index}>
                        <li>{counterparty.counterparty.name}</li>
                        <li>{counterparty.value}</li>
                      </ul>
                    );
                  } else {
                    return(
                      <ul style={{listStyleType: "none"}} key={index}>
                        <li>—</li>
                        <li>{counterparty.value}</li>
                      </ul>
                    );
                  }
                })}
              </div>
            );
          })}

          <b className="red">{this.props.reports.sum["Aug"]["Cost"]}</b>

          {this.props.reports.reports["Cost"]["Aug"].map((report, index) => {
            return(
              <div key={index}>
                <li>{report.article.title}</li>
                <li>{report.value}</li>

                {report.counterparties.map((counterparty, index) => {
                  if (counterparty.counterparty) {
                    return(
                      <ul key={index}>
                        <li>{counterparty.counterparty.name}</li>
                        <li>{counterparty.value}</li>
                      </ul>
                    );
                  } else {
                    return(
                      <ul key={index}>
                        <li>—</li>
                        <li>{counterparty.value}</li>
                      </ul>
                    );
                  }
                })}
              </div>
            );
          })}

          <b className="green">{this.props.reports.result["Aug"]}</b>
        </div>
        <hr/>

      </div>
    );

  }
}

