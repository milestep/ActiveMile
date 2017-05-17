import React, { Component, PropTypes } from 'react';
import moment                          from 'moment';
import FormSelect                      from '../layout/form/select';
import FormInput                       from '../layout/form/input';
import FormDatePicker                  from '../layout/form/datePicker';

export default class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    types: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      counterparty: this.createCounterpartyState(props),
      canSubmit: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  createCounterpartyState(props) {
    if (!props) props = this.props;

    const { counterparty, types } = props;

    let prev = counterparty ? {
      name: counterparty.name,
      date: moment(Date.parse(counterparty.date)),
      type: {
        value: counterparty.type,
        label: counterparty.type
      },
    } : {
      name: '',
      date: moment(),
      type: {
        value: types[0],
        label: types[0]
      },
    }, next = {};

    for (let i in prev) {
      next[i] = {};
      next[i]['value'] = prev[i];
      next[i]['blured'] = false;
    }

    return next;
  }

  handleChange = (field, values) => {
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

  handleSubmit(counterparty) {
    counterparty.type = counterparty.type.value

    this.props.handleSubmit(counterparty)
      .then(res => {
        if (this.refs.form) {
          this.setState({
            counterparty: this.createCounterpartyState()
          });
        }
      });
  }

  render() {
    const { counterparty, canSubmit } = this.state;
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
            value={counterparty.name.value}
            handleChange={this.handleChange}
            isBlured={counterparty.name.blured}
            validationErrors={{
             isRequired: "Title is required"
            }}
            required
          />

          <FormSelect
            name="type"
            value={counterparty.type.value}
            isBlured={counterparty.type.blured}
            options={typeOptions}
            handleChange={this.handleChange}
            required
          />

          <FormDatePicker
            name="date"
            selected={counterparty.date.value}
            handleChange={this.handleChange}
            dateFormat="YYYY/MM/DD"
            required
          />

          <button
            type="submit"
            className="btn btn-success"
            disabled={!canSubmit}
          >
            Add counterparty
          </button>
        </Formsy.Form>
      </div>
    );
  }
}
