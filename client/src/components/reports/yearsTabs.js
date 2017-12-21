import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import moment                             from 'moment';
import * as utils                         from '../../utils';

export default class YearsTabs extends Component {
   static propTypes = {
    current: PropTypes.array.isRequired,
    years: PropTypes.array.isRequired,
    handleYearChange: PropTypes.func.isRequired
   };

  render() {
    const { current, years, handleYearChange } = this.props
    let tabs = [];

    years.forEach((year, index) => {
      let listClassNames = []
      const isCurrent = current.includes(year)

      if (isCurrent) listClassNames.push('active');

      tabs.push(
        <li className={listClassNames.join(' ')}key={index}>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault()
              handleYearChange(year)
            }}
          >{year}</a>
        </li>
      );

      }
    );

     
    return(
      <ul className='nav nav-pills reports-filter-months-tabs'>{tabs}</ul>
    )
  }
}
