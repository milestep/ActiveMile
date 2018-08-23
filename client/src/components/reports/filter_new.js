import React, { Component } from 'react';
import moment from 'moment';
import { index as fetchRegisters }        from '../../actions/registers'
import { connect }                        from 'react-redux'
import { bindActionCreators }             from 'redux'

@connect(state => ({
  registers: state.registers.items,
  filterYears: state.registers.years
}), dispatch => ({
  actions: bindActionCreators({
    fetchRegisters
  }, dispatch)
}))

export default class FilterMonth extends Component {
  constructor(props) {
    super(props);

    var date = new Date()
    var currentMonth = date.getMonth()
    var currentYear = date.getFullYear()
    var monthNames = moment.monthsShort()
    this.state = {
      filter: {
        year: currentYear,
        month: {
                "Jan":false,
                "Feb":false,
                "Mar":false,
                "Apr":false,
                "May":false,
                "Jun":false,
                "Jul":false,
                "Jul":false,
                "Aug":false,
                "Sep":false,
                "Oct":false,
                "Nov":false,
                "Dec":false,
              }
        // month: monthNames
        },
        currentMonth: currentMonth
      }
    }


  componentDidMount() {
    this.fetchRegisters()
  }

  fetchRegisters() {
    let { actions } = this.props
    let params = {
      years: [this.state.filter.year],
      months: this.state.filter.month
    }
    actions.fetchRegisters(params).then(res => {
      console.log('fetch res', res.data)
      console.log('fetch params', params)
    })
  }

  handleClick(month) {
    console.info('clicked: ', month)
    this.setState({
      month: !this.state.filter.month[month]
    });
  }

  render() {
    let monthNames = moment.monthsShort()
    console.log("b", this.state.filter.month)
    return(
      <div>
      {monthNames.map((name, index) => {
        return(
          <ul style={{float: 'left'}} key={index}>
            <li style={{listStyleType: 'none'}} onClick={this.handleClick.bind(this, name)}>{name}</li>
          </ul>
        );
      })}
      </div>
    );
  }
}
