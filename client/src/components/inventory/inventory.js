import React, { Component } from 'react';
import InventoryItemsList   from './itemsList'
import InventoryForm        from './form'

export default class Inventory extends Component {
  render() {
    return (
      <div>
        <h3>Inventory</h3>

        <InventoryItemsList />

        <InventoryForm />
      </div>
    );
  }
}
