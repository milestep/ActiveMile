import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { actions as counterpartyActions } from '../../resources/counterparty';
import moment from 'moment';
import FormSelect from '../layout/form/select';
 
export default class Filtr extends Component {
  static propTypes = {
    counterparties: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      filtr: {
        year: {
          value: {
            value: moment().format('YYYY')
          }
        },
        month: {
          value: {
            value: moment().format('MMM')
          }
        }
      }
    };

    this.handleChange = this.handleChange.bind(this); 
  }

  handleChange(field, values) {
    this.setState((prevState) => ({
      filtr: {
        ...prevState.filtr,
        [field]: {
          ...prevState.filtr[field],
          ...values
        }
      }
    }));
  }

  dates() {
    // YEARS
    let years  = [], year, bool

    this.props.counterparties.map((counterparty, i) => {
      year = moment(Date.parse(counterparty.date)).format('YYYY')
      bool = false

      years.map((date, j) => {
        if (year === date) {
          bool = true
        }
      });

      if (!bool) {
        years.push(
          year
        );
      }
    });

    bool = false
    years.map((year, i) => {
      if (year === this.state.filtr.year.value.value) {
        bool = true
      }
    });

    if (!bool) {
      years.push(
        this.state.filtr.year.value.value
      );
    }

    // MONTHS
    let months = [];
    const month_all = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    month_all.forEach((month, i) => {
      const isCurrent = month === this.state.filtr.month.value.value ? true : false;

      months.push(
        <li key={i} className={`${ isCurrent ? 'active' : ''}`}><a>{ month }</a></li>
      );
    });

    return { years, months }
  }
  
  render() {
    let dates = this.dates()

    const typeOptions = dates.years.map((type, i) => {
      return {
        value: type,
        label: type
      }
    });

    return(
      <div>
        <div className="col-md-2">
          <Formsy.Form>
            <FormSelect
              name="year"
              value={this.state.filtr.year.value}
              options={typeOptions}
              handleChange={this.handleChange}
            /> 
          </Formsy.Form>
        </div>

        <div className="col-md-10">
          <div className="articles-tabs">
            <ul class="nav nav-tabs">
              { dates.months }
            </ul>
          </div>
        </div> 
      </div>
    );
  };
}
