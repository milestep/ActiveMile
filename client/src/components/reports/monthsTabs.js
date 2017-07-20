import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import moment                             from 'moment';
import * as utils                         from '../../utils';

const monthsNames = moment.monthsShort()

export default class MonthsTabs extends Component {
  static propTypes = {
    current: PropTypes.number.isRequired,
    available: PropTypes.array.isRequired,
    handleMonthChange: PropTypes.func.isRequired
  };

  render() {
    const { current, available, handleMonthChange } = this.props

    let tabs = [];

    monthsNames.forEach((month, index) => {
      const isCurrent = current == month;
      let listClassNames = [];

      if (isCurrent) listClassNames.push('active');
      if (available.indexOf(index) === -1)
        listClassNames.push('empty');

      tabs.push(
        <li className={listClassNames.join(' ')} key={month}>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault()
              handleMonthChange(index)
            }}
          >{month}</a>
        </li>
      );
    });

    return(
      <ul class='nav nav-pills reports-filter-months-tabs'>{tabs}</ul>
    )
  }
}
