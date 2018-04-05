import React, { Component }     from 'react';
import InventoryEditorsForm     from './edit/editForm';

export default class InventoryItemsEditor extends Component {
  render() {
    return (
      <div>
        <h3>Inventory items editor</h3>

        <InventoryEditorsForm params={this.props.params} dispatch={this.props.dispatch} />
      </div>
    );
  }
}
