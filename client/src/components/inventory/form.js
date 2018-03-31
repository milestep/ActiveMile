import React, { Component }                 from 'react';
import moment                               from 'moment';
import FormDatePicker                       from '../layout/form/datePicker';
import { bindActionCreators }               from 'redux';
import { connect }                          from 'react-redux';
import { create  as createInventoryItem }   from '../../actions/inventory';

@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({
      createInventoryItem
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
      }
    };
  }

  handleSubmit(element) {
    const { item } = this.state;
    const { actions } = this.props;

    actions.createInventoryItem(item);
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
      <div className='col-sm-3'>
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
