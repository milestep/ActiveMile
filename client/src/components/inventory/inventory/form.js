import React, { Component }                 from 'react'
import moment                               from 'moment'
import { bindActionCreators }               from 'redux'
import { connect }                          from 'react-redux'
import FormSelect                           from '../../layout/form/select'
import FormDatePicker                       from '../../layout/form/datePicker'
import { create  as createInventoryItem }   from '../../../actions/inventory'
import { toaster }                          from '../../../actions/alerts'
import * as utils                           from '../../../utils'

@connect(
  state => ({
    counterparties: state.counterparties.app.items
  }),
  dispatch => ({
    actions: bindActionCreators({
      createInventoryItem,
      toaster
    }, dispatch)
  })
)
export default class InventoryForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      item: {
        name: null,
        date: moment(),
        counterparty: {
          value: null,
          label: null
        }
      }
    }

    this.toaster = props.actions.toaster()
  }

  handleSubmit() {
    const { name, date, counterparty} = this.state.item
    const id = counterparty.value
    const { actions } = this.props

    const item = {
      name: name,
      date: date,
      counterparty_id: id
    }

    return new Promise((resolve, reject) => {
      actions.createInventoryItem(item)
        .then(res => {
          this.toaster.success('Item has been successfully created')
          resolve(res)
        })
        .catch(err => {
          if (utils.debug) console.error(err)
          this.toaster.error('Could not create an item!')
          reject(err)
        })
    })
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
    const counterpartyOptions = this.props.counterparties.map((counterparty) => {
      return {
        value: counterparty.id,
        label: counterparty.name
      }
    })

    return (
      <div className='col-sm-4'>
        <Formsy.Form onSubmit={ this.handleSubmit.bind(this) }>
          <div className="form-group">
            <label for="name">Name:</label>

            <input
              onChange={ this.handleChange.bind(this, 'name') }
              className="form-control"
              id="name"
              name="name"
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
              required
              name="date"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
          >Submit</button>
        </Formsy.Form>
      </div>
    )
  }
}
