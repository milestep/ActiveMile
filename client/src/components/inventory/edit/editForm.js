import React, { Component }                 from 'react'
import moment                               from 'moment'
import { bindActionCreators }               from 'redux'
import { connect }                          from 'react-redux'
import { Link }                             from 'react-router'
import { push }                             from 'react-router-redux'
import FormSelect                           from '../../layout/form/select'
import FormDatePicker                       from '../../layout/form/datePicker'
import { toaster }                          from '../../../actions/alerts'
import * as utils                           from '../../../utils'
import                                           '../../../styles/inventory/buttons.css'
import { update as updateInventoryItem,
         show   as fetchInventoryItem }     from '../../../actions/inventory'

@connect(
  state => ({
    inventory: state.inventory.items,
    inventoryItem: state.inventory.item,
    counterparties: state.counterparties.app.items
  }),
  dispatch => ({
    actions: bindActionCreators({
      updateInventoryItem,
      fetchInventoryItem,
      toaster
    }, dispatch)
  })
)
export default class InventoryEditorsForm extends Component {
  constructor(props) {
    super(props)
    this.toaster = props.actions.toaster()
    this.state = {
      item: {
        name: '',
        date: moment(),
        counterparty: {
          value: null,
          label: null
        }
      }
    }
  }

  handleSubmit() {
    const { actions, params, dispatch } = this.props
    const { id } = params
    let { item } = this.state

    item.date.add(1, 'days')

    return new Promise((resolve, reject) => {
      actions.updateInventoryItem(item, id)
        .then(res => {
          dispatch(push('/inventory'))
          this.toaster.success('Item has been successfully updated')
          resolve(res)
        })
        .catch(err => {
          if (utils.debug) console.error(err)
          this.toaster.error('Could not update an item!')
          reject(err)
        })
    })
  }

  componentDidMount() {
    this.fetchInventoryItem()
  }

  fetchInventoryItem() {
    const { actions, params } = this.props
    const { id } = params

    actions.fetchInventoryItem(id)
  }

  componentWillReceiveProps(newProps) {
    const { inventoryItem, counterparties } = newProps
    const { counterparty_id, date, name } = inventoryItem
    const { item } = this.state
    let currentCounterparty

    if (counterparty_id) {
      const filterCounterparties = counterparties.map((counterparty) => {
        if (counterparty.id == counterparty_id) currentCounterparty = counterparty
      })

      const counterpartyOption = {
        value: currentCounterparty.id,
        label: currentCounterparty.name
      }

      this.setState({
        item: {
          name: name,
          date: moment(date),
          counterparty: {
            value: counterpartyOption.value,
            label: counterpartyOption.label
          }
        }
      })
    }
  }

  handleChange(field, event) {
    if (field == 'date') {
      if (event.value) {
        this.setState((prevState) => ({
          item: {
            ...prevState.item,
            date: event.value
          }
        }))
      }

    } else if (field == 'counterparty') {
      if (event.value) {
        this.setState((prevState) => ({
          item: {
            ...prevState.item,
            counterparty: {
              value: event.value.value,
              label: event.value.label
            }
          }
        }))
      }

    } else {
      event.persist()

      this.setState((prevState) => ({
        item: {
          ...prevState.item,
          [field]: event.target.value
        }
      }))
    }
  }

  render() {
    const { counterparties } = this.props
    let filteredOptions = []

    const filterCounterparties = counterparties.map((counterparty) => {
      if (counterparty.type !== 'Client') filteredOptions.push(counterparty)
    })

    const counterpartyOptions = filteredOptions.map((counterparty) => {
      return {
        value: counterparty.id,
        label: counterparty.name
      }
    })

    return (
      <div className='col-sm-offset-4 col-sm-4'>
        <Formsy.Form onSubmit={ this.handleSubmit.bind(this) }>
          <div className="form-group">
            <label for="name">Name:</label>

            <input
              onChange={ this.handleChange.bind(this, 'name') }
              value={ this.state.item.name }
              className="form-control"
              name="name"
              id="name"
              required
            />
          </div>

          <FormSelect
            handleChange={ this.handleChange.bind(this) }
            value={ this.state.item.counterparty.value }
            options={ counterpartyOptions }
            title="Counterparty:"
            name="counterparty"
          />

          <div className="form-group">
            <label for="date">Date:</label>

            <FormDatePicker
              handleChange={ this.handleChange.bind(this) }
              selected={ this.state.item.date }
              name="date"
              id="date"
              required
            />
          </div>

          <div className="btn-group pull-right">
            <button
              type="submit"
              className="btn btn-sm btn-danger"
            >Update</button>

            <div className="btn btn-sm btn-primary">
              <Link to='/inventory'>
                <span className='edited-button'>Cancel</span>
              </Link>
            </div>
          </div>
        </Formsy.Form>
      </div>
    )
  }
}
