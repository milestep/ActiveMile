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
    return (
      <input 
        type="text" 
        className="form-control" 
        onChange={this.onChange}
        onClick={this.props.onClick} 
        value={this.props.value} 
        defaultValue={this.props.defaultValue} 
      />
    )
  }
}
