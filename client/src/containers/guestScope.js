import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';

export default class GuestScope extends React.Component {
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
