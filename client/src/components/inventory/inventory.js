import React, { Component }                 from 'react'
import { bindActionCreators }               from 'redux'
import { connect }                          from 'react-redux'
import InventoryForm                        from './inventory/form'
import InventoryItemsList                   from './inventory/itemsList'
import * as utils                           from '../../utils'
import { actions as subscriptionActions }   from '../../actions/subscriptions'

@connect(
  state => ({
    counterparties: state.counterparties.rest.items
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...subscriptionActions,
    }, dispatch)
  })
)
export default class Inventory extends Component {
  constructor(props) {
    super(props)
    this.subscriptions = ['counterparties']
  }

  componentWillMount() {
    this.props.actions.subscribe(this.subscriptions)
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions)
  }

  render() {
    return (
      <div>
        <h3>Inventory</h3>

        <InventoryItemsList />

        <InventoryForm />
      </div>
    )
  }
}
