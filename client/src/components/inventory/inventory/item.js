import React, { Component, PropTypes }      from 'react'
import moment                               from 'moment'
import { connect }                          from 'react-redux'
import { Link }                             from 'react-router'
import { bindActionCreators }               from 'redux'
import { destroy as destroyInventoryItem }  from '../../../actions/inventory'
import { toaster }                          from '../../../actions/alerts'
import * as utils                           from '../../../utils'

@connect(
  state => ({
    inventory: state.inventory.items,
    counterparties: state.counterparties.app.items
  }),
  dispatch => ({
    actions: bindActionCreators({
      destroyInventoryItem,
      toaster
    }, dispatch)
  })
)
export default class InventoryItem extends Component {
  static propTypes = {
    inventory: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { edit: null }
    this.toaster = props.actions.toaster()
  }

  handleDestroy(id) {
    const { actions } = this.props

    if (confirm("Are you sure?")) {
      return new Promise((resolve, reject) => {
        actions.destroyInventoryItem(id)
          .then(res => {
            this.toaster.success('Item has been successfully deleted')
            resolve(res)
          })
          .catch(err => {
            if (utils.debug) console.error(err)
            this.toaster.error('Could not delete an item!')
            reject(err)
          })
      })
    }
  }

  render() {
    const { counterparties, inventory } = this.props

    return (
      <tbody>
        { inventory.map((item, index) => {
          let currentCounterparty

          counterparties.map((counterparty) => {
            if (counterparty.id == item.counterparty_id) currentCounterparty = counterparty
          })

          const counterpartyName = (currentCounterparty)? currentCounterparty.name : null

          return (
            <tr key={ index }>
              <td className='col-xs-1'>{ index + 1 }</td>

              <td className='col-xs-4'>{ item.name }</td>

              <td className='col-xs-2'>{ moment(item.date).format("DD-MM-YYYY") }</td>

              <td className='col-xs-3'>{ counterpartyName }</td>

              <td>
                <div className="btn-group pull-right" >
                  <Link
                    to={`/inventory/${item.id}/edit`}
                    className="btn btn-primary btn-sm"
                  >
                    <i className="glyphicon glyphicon-pencil"></i>
                  </Link>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={ this.handleDestroy.bind(this, item.id) }
                  >
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    )
  }
}

