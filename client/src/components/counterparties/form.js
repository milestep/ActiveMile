import React, { Component } from 'react'; 
import moment from 'moment';
import FormSelect from '../layout/form/select';
import FormInput from '../layout/form/input';
import FormDatePicker from '../layout/form/datePicker.js';

export default class Form extends Component {
  constructor(props) {
    super(props);

    const { counterparty, types } = props;

    this.counterpartyState = {
      name: {
        value: (counterparty && counterparty.name) ? counterparty.name : '',
        blured: false,
      },
      date: '',
      start_date: moment(),
      type: {
        value: (counterparty && counterparty.type) ? {
          value: counterparty.type,
          label: counterparty.type
        } : {
          value: types[0],
          label: types[0]
        },
        blured: false,
      }
    }

    this.state = {
      counterparty: this.counterpartyState,
      canSubmit: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.onChangeDueDate = this.onChangeDueDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(field, values) {
    this.setState((prevState) => ({
      counterparty: {
        ...prevState.counterparty,
        [field]: {
          ...prevState.counterparty[field],
          ...values
        }
      }
    }));
  }

  toggleButton(status) {
    this.setState({
      canSubmit: status
    });
  }

  onChangeDueDate(e) {
    this.setState((prevState) => ({
      ...prevState,
      counterparty: {
        ...prevState.counterparty,
        date: e._d,
        start_date: e
      }
    }));
  }

  handleSubmit(counterparty) {
    counterparty.type = counterparty.type.value
     
    this.props.handleSubmit(counterparty)
      .then(res => {
        if (this.refs.form) {
          this.setState({
            counterparty: this.counterpartyState
          });
          this.refs.form.reset();
        }
      });
  }
 
  render() {
    const typeOptions = this.props.types.map((type, i) => {
      return {
        value: type,
        label: type
      }
    });

    return (
      <div>
        <Formsy.Form
          ref="form"
          onValidSubmit={this.handleSubmit} 
          onValid={this.toggleButton.bind(this, true)} 
          onInvalid={this.toggleButton.bind(this, false)}
          className="counterpartyForm"
        >

          <FormInput
            name="name"
            placeholder="Name *"
            value={this.state.counterparty.name.value}
            handleChange={this.handleChange}
            isBlured={this.state.counterparty.name.blured}
            validationErrors={{
             isRequired: "Title is required"
            }}
            required
          />

          <FormSelect
            name="type"
            value={this.state.counterparty.type.value}
            isBlured={this.state.counterparty.type.blured}
            options={typeOptions}
            handleChange={this.handleChange}
            validationErrors={{
              isRequired: "Type is required"
            }}
            required
          />

          <FormDatePicker
            name="date"
            minDate={moment()}
            selected={this.state.counterparty.start_date}
            handleChange={this.onChangeDueDate}
            dateFormat="YYYY/MM/DD"
            required
          />
 
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={!this.state.canSubmit}
          >
            Add counterparty
          </button>
        </Formsy.Form>
      </div>
    );
  }
}
