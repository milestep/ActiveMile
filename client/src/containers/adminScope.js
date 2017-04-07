import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';

export default class AdminScope extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    return this.props.children;
  }
}
