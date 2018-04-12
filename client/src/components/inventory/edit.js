import React, { Component }                 from 'react'
import InventoryEditorsForm                 from './edit/editForm'
import { bindActionCreators }               from 'redux'
import { actions as subscriptionActions }   from '../../actions/subscriptions'
import { connect }                          from 'react-redux'

@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({
      ...subscriptionActions,
    }, dispatch)
  })
)
export default class InventoryItemsEditor extends Component {
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
        <h3 className="text-center">Inventory items editor</h3>

        <InventoryEditorsForm params={this.props.params} dispatch={this.props.dispatch} />
      </div>
    )
  }
}
