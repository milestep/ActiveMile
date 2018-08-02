import React, { Component }       from 'react';
import HolidayItemsList           from './holidays/holidays_list'
import HolidaysForm               from './holidays/holidays_form'
import { getCurrentUser }         from '../../helpers/currentUser'
export default class Holidays extends Component {
  render() {
    return (
      <div>
        <h3>Holidays</h3>

        <HolidayItemsList />
        { getCurrentUser() != null ? <HolidaysForm /> : null }
      </div>
    );
  }
}
