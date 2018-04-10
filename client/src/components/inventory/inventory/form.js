import React, { Component }                 from 'react';
import moment                               from 'moment';
import { bindActionCreators }               from 'redux';
import { connect }                          from 'react-redux';
import FormSelect                           from '../../layout/form/select';
import FormDatePicker                       from '../../layout/form/datePicker';
import { create  as createInventoryItem }   from '../../../actions/inventory';
import { toaster }                          from '../../../actions/alerts';
import * as utils                           from '../../../utils';

@connect(
  state => ({
    counterparties: state.counterparties.rest.items
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
    super(props);

    this.state = {
      item: {
        name: null,
        date: moment()
      },
      inventory: this.createInventoryState(props)
    };

    this.toaster = props.actions.toaster();
  }

  createInventoryState(props) {
    if (!props) props = this.props;
  }

  handleSubmit() {
    const { item } = this.state;
    const { actions } = this.props;

    return new Promise((resolve, reject) => {
      actions.createInventoryItem(item)
        .then(res => {
          this.toaster.success('Item has been successfully created');
          resolve(res);
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          this.toaster.error('Could not create an item!');
          reject(err)
        })
    })
  }

  handleChange(field, element) {
    if (field == 'date') {
      if (element.value) {
        this.setState((prevState) => ({
          item: {
            ...prevState.item,
            date: element.value
          }
        }));
      }
    } else {
      let input = element.target.value;

      this.setState((prevState) => ({
        item: {
          ...prevState.item,
          [field]: input
        }
      }));
    }
  }

  render() {
    return (
      <div className='col-sm-4'>
        <Formsy.Form onSubmit={ this.handleSubmit.bind(this) }>
          <div className="form-group">
            <label for="name">Name:</label>
            <input
              onChange={ this.handleChange.bind(this, 'name') }
              className="form-control"
              id="name"
              required
            />
          </div>

          <FormSelect
            title="Counterparty"
            name="counterparty"
          />

          <div className="form-group">
            <label for="date">Date:</label>
            <FormDatePicker
              handleChange={ this.handleChange.bind(this) }
              selected={ this.state.item.date }
              name="date"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
          >Submit</button>
        </Formsy.Form>
      </div>
    );
  }
}
