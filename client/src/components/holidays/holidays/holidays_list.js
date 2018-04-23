import React, { Component }                 from 'react';
import { connect }                          from 'react-redux';
import { bindActionCreators }               from 'redux';
import { index as fetchHolidays }           from '../../../actions/holidays';
import { actions as subscriptionActions }   from '../../../actions/subscriptions';
import HolidayItem                          from './holiday';

@connect(
  state => ({
    holidays: state.holidays.items
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...subscriptionActions,
      fetchHolidays
    }, dispatch)
  })
)
export default class HolidayItemsList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.fetchHolidays()
  }

  fetchHolidays() {
    const { actions } = this.props;
    actions.fetchHolidays();
  }

  render() {
    return (
      <div className='col-sm-8'>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

          <HolidayItem />
        </table>
      </div>
    );
  }
}
