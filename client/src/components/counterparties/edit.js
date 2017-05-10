import React, { Component, PropTypes } from 'react'; 
import moment from 'moment';
import FormSelect from '../layout/form/select';
import FormInput from '../layout/form/input';
import FormDatePicker from '../layout/form/datePicker.js';

export default class Edit extends Component {
  static propTypes = {
    counterparty: PropTypes.object.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    toggleEdited: PropTypes.func.isRequired,
    types: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    const { counterparty, types } = props;
    
    this.counterpartyState = {
      name: {
        value: counterparty.name,
        blured: true,
      },
      date: '',
      start_date: moment(),
      type: {
        value: {
          value: counterparty.type,
          label: counterparty.type
        },
        blured: true,
      }
    }

    this.state = {
      counterparty: this.counterpartyState,
      canSubmit: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.onChangeDueDate = this.onChangeDueDate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
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

  handleUpdate(counterparty) {
    counterparty.type = counterparty.type.value
    this.props.handleUpdate(counterparty, this.props.counterparty.id)
  }
 
  render() {
    const typeOptions = this.props.types.map((type, i) => {
      return {
        value: type,
        label: type
      }
    });

    return (
      <Formsy.Form
        ref="form"
        onValidSubmit={this.handleUpdate}
        onValid={this.toggleButton.bind(this, true)} 
        onInvalid={this.toggleButton.bind(this, false)}
        className="counterpartyForm"
      >
        
        <div className="counterparty-overlap">
          <div className="col-md-4">
            <FormInput
              inputClassName="input-sm"
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
          </div>

          <div className="col-md-3">
            <FormSelect
              selectClassName="select-sm"
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
          </div>

           <FormDatePicker
            inputClassName="input-sm"
            name="date"
            minDate={moment()}
            selected={this.state.counterparty.start_date}
            handleChange={this.onChangeDueDate}
            dateFormat="YYYY/MM/DD"
            required
          /> 

          <div className="text-right">
            <div className="btn-group">
              <button className="btn btn-sm btn-success">Update</button>
              <button 
                className="btn btn-sm btn-primary" 
                onClick={this.props.toggleEdited.bind(this, this.state.counterparty.id, false)}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </Formsy.Form>
    );
  }
}
