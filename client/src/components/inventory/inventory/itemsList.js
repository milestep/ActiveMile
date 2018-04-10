import React, { Component }                 from 'react'
import { connect }                          from 'react-redux'
import { bindActionCreators }               from 'redux'
import { index as fetchInventory }          from '../../../actions/inventory'
import { actions as subscriptionActions }   from '../../../actions/subscriptions'
import InventoryItem                        from './item'

@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({
      ...subscriptionActions,
      fetchInventory
    }, dispatch)
  })
)
export default class InventoryItemsList extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.fetchInventory()
  }

  fetchInventory() {
    const { actions } = this.props
    actions.fetchInventory()
  }

  render() {
    return (
      <div className='col-sm-8'>
        <table className="table table-hover">
          <thead>
            <tr>
              <th className='col-xs-1'>№</th>
              <th>Name</th>
              <th>Date</th>
              <th>Counterparty</th>
              <th>&nbsp;</th>
            </tr>
          </thead>

          <InventoryItem />
        </table>
      </div>
    );
  }
}
