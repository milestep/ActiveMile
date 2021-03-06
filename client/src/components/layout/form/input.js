import React, { Component }      from 'react';
import Formsy,
  { Decorator as FormsyElement } from 'formsy-react';

@FormsyElement()
export default class FormInput extends Component {
  constructor(props) {
    super(props);

    this.handleBlur = this.handleBlur.bind(this)
    this.changeValue = this.changeValue.bind(this)
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

  getRequiredMessage() {
    const {
      value,
      isBlured,
      validationErrors,
      showRequired,
      showError
    } = this.props;

    if (isBlured && (!value && showRequired() && !showError())) {
      return validationErrors.isRequired;
    }
    return '';
  }

  getAllMessages() {
    const { isBlured, getErrorMessage } = this.props;
    const errorMessage = isBlured ? wrapMessage(getErrorMessage()) : '';
    const requiredMessage = wrapMessage(this.getRequiredMessage());

    function wrapMessage(message) {
      return (message ?
        <span className='help-block'>{message}</span> : ''
      );
    }

    return(
      <div className="error-messages-overlap">
        {errorMessage}
        {requiredMessage}
      </div>
    );
  }

  getClassName() {
    const {
      isBlured, className, showError, showRequired
    } = this.props;
    let newClassName = 'form-group' + (className || '');

    if (isBlured && (showRequired() || showError())) {
      newClassName += ' has-error';
    }

    return newClassName;
  }

  isCheckbox() {
    return this.props.type === 'checkbox' ? true : false;
  }

  changeValue(e) {
    const { name, handleChange, setValue } = this.props;
    let newValue = e.currentTarget[
      this.isCheckbox() ? 'checked' : 'value'
    ];

    setValue(newValue);
    handleChange(name, {value: newValue});
  }

  handleBlur(e) {
    this.props.handleChange(this.props.name, {blured: true});
  }

  render() {
    const className = this.getClassName();
    const errorMessages = this.getAllMessages();
    const {
      inputClassName, placeholder, type, value, getValue
    } = this.props;

    return (
      <div className={this.isCheckbox() ? 'input-checkbox' : className}>
        {this.getLabel()}
        <input
          checked={this.isCheckbox() && getValue() ? 'checked' : null}
          className={this.isCheckbox() ? 'form-check-input' : `form-control${inputClassName ? ' ' + inputClassName : ''}`}
          name={this.props.name}
          onBlur={this.handleBlur}
          onChange={this.changeValue}
          placeholder={placeholder || null}
          type={type || 'text'}
          value={value}
        />
        {errorMessages}
      </div>
    );
  }
};
