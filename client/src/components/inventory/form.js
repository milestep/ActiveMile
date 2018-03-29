import React, { Component } from 'react';
import moment               from 'moment';
import FormDatePicker       from '../layout/form/datePicker';

export default class InventoryForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      date: moment()
    };
  }

  handleSubmit(element) {
    // element.preventDefault();
    console.log('name', this.state.name);
    console.log('date', this.state.date);
  }

  handleChange(field, element) {
    if (field == 'date') {
      if (element.value) this.state[field] = element.value;
    } else {
      this.state[field] = element.target.value;
    }
    console.log('change', this.state.date)
  }

  render() {
    console.log('now', this.state.date)
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
              selected={ this.state.date }
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
