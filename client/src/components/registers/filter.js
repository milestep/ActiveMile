import React, { Component, PropTypes } from 'react';
import Select                          from 'react-select';
import moment                          from 'moment';
import * as utils                      from '../../utils';

export default class RegistersFilter extends Component {
  static propTypes = {
    filter: PropTypes.object.isRequired,
    current: PropTypes.object.isRequired,
    handleFilterChange: PropTypes.func.isRequired
  };

  render() {
    const { filter, current, handleFilterChange } = this.props;
    const monthsNames = moment.monthsShort();
    let activeCounterparties = filter.counterparties.filter((cp) => {
      return cp.active
    })
    const options = {
      years: filter.years.map((year) => {
        return { value: year, label: year };
      }),
      months: monthsNames.map((monthName, index) => {
        return { value: index + 1, label: monthName };
      }),

      counterparties: activeCounterparties.map((cp) => {
        return { value: cp.id, label: cp.name}
      })
    }

    return(
      <div className="registers-filter">
        <Select
          name="years"
          className="registers-filter-select"
          onChange={handleFilterChange('year')}
          options={options.years}
          value={current.year}
        />
        <Select
          name="months"
          className="registers-filter-select"
          onChange={handleFilterChange('month')}
          options={options.months}
          value={current.month}
        />
        <Select
          name="counterparty"
          className="registers-filter-select"
          onChange={handleFilterChange('counterparty_id')}
          options={options.counterparties}
          value={current.counterparty_id}
        />
      </div>
    )
  }
}
