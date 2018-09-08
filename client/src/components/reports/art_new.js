import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import '../../styles/reports/checkbox.css'
import { index as fetchReports } from '../../actions/reports'
import moment from 'moment';

@connect(state => ({
  reports: state.reports.items
}), dispatch => ({
  actions: bindActionCreators({
    fetchReports,
  }, dispatch)
}))

export default class ArtNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: 2018,
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5': false,
      '6': false,
      '7': false,
      '8': false,
      '9': false,
      '10': false,
      '11': false,
      '12': false

    }
  }

  componentDidMount() {
    this.fetchReports()
  }

  fetchReports() {
    const { actions } = this.props;
    actions.fetchReports()
  }

  updateYear(value) {
    this.setState({ year: value }, () => {
      this.props.actions.fetchReports({
        year: [this.state.year],
        month: this.filteredMonth(),
        filter_by: 'month'
      })
    })
  }

  filteredMonth() {
    let result = [];
    for (let i = 1; i < 13; i++) {
      if (this.state[i.toString()]) {
        result.push(i)
      }
    }
    return result;
  }

  updateMonths(value) {
    this.setState({ [value]: !this.state[value] }, () => {
      this.props.actions.fetchReports({
        year: [this.state.year],
        month: this.filteredMonth(),
        filter_by: 'month'
      })
    })

  }

  render() {
    let elements = document.getElementsByClassName('month-item');

    for (let e = 0; e < elements.length; e++) {
      elements[e].onclick = function () {
        this.classList.toggle('month-active')
      }
    }

    const { reports } = this.props;
    const date = Object.keys(reports).map((date) => {
       const month = moment(new Date(date)).format("MMM");
       return month;
    })

    const dataRevenue = Object.values(reports).map((register) => {
      return register['Revenue'] !== undefined ? register['Revenue'].total : 0;
    })

    const dataCost = Object.values(reports).map((register) => {
      return register['Cost'] !== undefined ? register['Cost'].total : 0;
    })

    const profit = Object.values(reports).map((register) => {
      return register.profit !== undefined ? register.profit : 0;
    })

    return (
      <div>
        <div className="container">
          <input
            type="number"
            min="1900"
            max="2118"
            step="1"
            value={this.state.year}
            className="select-data"
            onChange={(e) => {
              this.updateYear(e.target.value)
              e.preventDefault()
            }}
          />

          <button className="month-item" onClick={() => { this.updateMonths('1') }}>Jan</button>
          <button className="month-item" onClick={() => { this.updateMonths('2') }}>Feb</button>
          <button className="month-item" onClick={() => { this.updateMonths('3') }}>Mar</button>
          <button className="month-item" onClick={() => { this.updateMonths('4') }}>Apr</button>
          <button className="month-item" onClick={() => { this.updateMonths('5') }}>May</button>
          <button className="month-item" onClick={() => { this.updateMonths('6') }}>Jun</button>
          <button className="month-item" onClick={() => { this.updateMonths('7') }}>Jul</button>
          <button className="month-item" onClick={() => { this.updateMonths('8') }}>Aug</button>
          <button className="month-item" onClick={() => { this.updateMonths('9') }}>Sep</button>
          <button className="month-item" onClick={() => { this.updateMonths('10') }}>Oct</button>
          <button className="month-item" onClick={() => { this.updateMonths('11') }}>Nov</button>
          <button className="month-item" onClick={() => { this.updateMonths('12') }}>Dec</button>
        </div>

        {date.map((m, index) => {
          return <div key={index} style={{ width: 70, display: 'inline-block' }}>{m}</div>;
        })
        }
        <div className="clearfix"></div>
        {dataRevenue.map((el, index) => {
          return <div key={index} style={{ width: 70, display: 'inline-block' }} className='blue'>{el}</div>;
        })
        }

        {Object.values(reports).map((rev) => {
          if (rev.Revenue !== undefined) {
            return Object.keys(rev.Revenue).map((title, index) => {
              if (title !== 'total') {
                return <div key={index}>{title}</div>
              }
            })
          }
          Object.entries(reports).map((value) => {
            console.log(value);
          })
        })}

        <div className="clearfix"></div>
        {dataCost.map((el, index) => {
          return <div key={index} style={{ width: 70, display: 'inline-block' }} className='red'>{el}</div>;
        })
        }

        <div className="clearfix"></div>
        {profit.map((p, index) => {
          return <div key={index} style={{ width: 70, display: 'inline-block' }} className='green'>{p}</div>;
        })
        }

      </div>
    );
  }
}

