import React, { Component }                 from 'react';
import { connect }                          from 'react-redux';
import { bindActionCreators }               from 'redux';
import { index as fetchInventory }          from '../../actions/inventory';
import { actions as subscriptionActions }   from '../../actions/subscriptions'

@connect(
  state => ({
    inventory: state.items
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...subscriptionActions,
      fetchInventory
    }, dispatch)
  })
)
export default class InventoryItemsList extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.subscribe(this.subscriptions)
      .then(() => {
        this.fetchInventory()
      })
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions)
  }

  fetchInventory() {
    const { actions } = this.props;
    actions.fetchInventory();
  }

  render() {
    console.log(this.props.inventory)
    return (
      <div className='col-sm-9'>
        <p>items</p>
      </div>
    );
  }
}
