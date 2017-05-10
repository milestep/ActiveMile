import React, { Component }      from 'react';
import DatePicker                from 'react-datepicker'
import Formsy, 
  { Decorator as FormsyElement } from 'formsy-react';
import DateInput                 from './datePicker/dateInput';

@FormsyElement()
export default class FormDatePicker extends Component {
  constructor(props) {
    super(props);

    this.changeValue = this.changeValue.bind(this)
  }

  componentWillMount() {
    const { setValue, selected } = this.props;
    if (selected) setValue(selected);
  }

  changeValue = e => {
    const { handleChange, setValue } = this.props;
    const date = e._d;

    setValue(date);
    handleChange(e);
  }

  getLabel() {
    const { label, title, name, isRequired } = this.props;
    const allowLabel = label !== false ? true : false;

    return ((allowLabel && title) ?
      <label htmlFor={name}>
        { title } { isRequired() ? '*' : null }
      </label>
      : null
    );
  }

  render() {
    const { className } = this.props;
    const wrapperClass = `form-group ${className ? ' ' + className : ''}`;

    return (
      <div className={wrapperClass}>
        {this.getLabel()}
        <DatePicker
          className='form-control'
          customInput={
            this.props.customInput || 
            <DateInput 
              inputClassName={this.props.inputClassName}
              value={this.props.value}
              onChange={this.changeValue} 
            />
          }
          minDate={this.props.minDate}
          onChange={this.changeValue}
          placeholderText={this.props.placeholderText || null}
          selected={this.props.selected}
          value={this.props.value}
          fixedHeight
        />
      </div>
    );
  }
};
