import React, { Component }                 from 'react'
import { bindActionCreators }               from 'redux'
import { connect }                          from 'react-redux'
import cookie                               from 'react-cookie'
import InventoryForm                        from './inventory/form'
import InventoryItemsList                   from './inventory/itemsList'
import { index as fetchCounterparties }     from '../../actions/counterparties'
import * as utils                           from '../../utils'

@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({
      fetchCounterparties
    }, dispatch)
  })
)
export default class Inventory extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { actions } = this.props
    actions.fetchCounterparties()
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
