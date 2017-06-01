import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import moment                             from 'moment';
import * as utils                         from '../../utils';

export default class MonthsTabs extends Component {
  static propTypes = {
    articles: PropTypes.object.isRequired,
    current: PropTypes.object.isRequired,
    handleMonthChange: PropTypes.func.isRequired
  };

  render() {
    const { articles, current, handleMonthChange } = this.props;
    const monthsNames = moment.monthsShort();

    let tabs = [];

    monthsNames.forEach((month, i) => {
      const monthState = articles[current.year][month];
      const isCurrent = current.month == month;
      let listClassNames = [];

      if (isCurrent) listClassNames.push('active');
      if (!monthState) listClassNames.push('empty');

      if (monthState) {}
      tabs.push(
        <li className={listClassNames.join(' ')} key={month}>
          <a
            href="#"
            onClick={(e) => handleMonthChange(month)(e)}
          >{month}</a>
        </li>
      );
    });

    return(
      <ul class="nav nav-pills reports-filter-months-tabs">
        {tabs}
      </ul>
    );
  }
}