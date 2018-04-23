import React, { Component }     from 'react';
import HolidaysEditForm         from './edit/editForm';

export default class HolidaysItemsEditor extends Component {
  render() {
    return (
      <div>
        <h3>Holidays editor</h3>

        <HolidaysEditForm params={this.props.params} dispatch={this.props.dispatch} />
      </div>
    );
  }
}
