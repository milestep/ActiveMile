import React, { PropTypes, Component } from 'react';

export default class DateInput extends Component {
  static propTypes = {
    onChange: React.PropTypes.func,
    onClick: React.PropTypes.func,
    value: React.PropTypes.string
  };

  onChange(e) {
    e.preventDefault();
    this.props.onChange(e);
  }

  render () {
    const { inputClassName, onClick, value, defaultValue } = this.props;
    const className = `form-control${inputClassName ? ' ' + inputClassName : ''}`;

    return (
      <input 
        type="text" 
        className={className}
        onChange={this.onChange}
        onClick={onClick} 
        value={value} 
        defaultValue={defaultValue} 
      />
    )
  }
}
