import React, { Component }                 from 'react'
import InventoryEditorsForm                 from './edit/editForm'
import { bindActionCreators }               from 'redux'
import { connect }                          from 'react-redux'
import { index as fetchCounterparties }     from '../../actions/counterparties'

@connect(
  state => ({
    counterparties: state.counterparties.app.items
  }),
  dispatch => ({
    actions: bindActionCreators({
      fetchCounterparties
    }, dispatch)
  })
)
export default class InventoryItemsEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetched: false
    }
  }

  componentWillMount() {
    const { actions, counterparties } = this.props
    if (counterparties.length == 0) actions.fetchCounterparties()
  }

  componentWillReceiveProps(newProps) {
    const { counterparties } = newProps
    const { isFetched } = this.state

    if (counterparties.length == 0 && !isFetched) {
      actions.fetchCounterparties()
      this.setState({ isFetched: true })
    }
  }

  render() {
    return (
      <div>
        <div>
          <h3 className="text-center">Inventory items editor</h3>
        </div>

        <InventoryEditorsForm params={this.props.params} dispatch={this.props.dispatch} />
      </div>
    )
  }
}
