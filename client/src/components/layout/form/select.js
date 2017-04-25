import React, { Component }      from 'react';
import Formsy, 
  { Decorator as FormsyElement } from 'formsy-react';
import Select                    from 'react-select';

@FormsyElement()
export default class FormSelect extends Component {
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

    if (isBlured && ((!value || !value.value) && showRequired() && !showError())) {
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

  changeValue(value) {
    const { name, handleChange, setValue } = this.props;

    if (!value || !value.value) {
      value = this.props.value;
    }

    setValue(value.value || '');
    handleChange(name, {value: value});
  }

  handleBlur(e) {
    this.props.handleChange(this.props.name, {blured: true});
  }

  render() {
    const className = this.getClassName();
    const errorMessages = this.getAllMessages();
    const { name, options, value, selectClassName } = this.props;

    return (
      <div className={className}>
        {this.getLabel()}
        <Select
          name={name}
          onBlur={this.handleBlur}
          onChange={this.changeValue}
          className={selectClassName || ''}
          options={options}
          value={value.value}
        />
        {errorMessages}
      </div>
    );
  }
};
