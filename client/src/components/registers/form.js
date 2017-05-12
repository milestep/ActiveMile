import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { bindActionCreators }          from 'redux';
// import { actions as articleActions }   from '../../resources/article';
import FormInput                       from '../layout/form/input';
import FormSelect                      from '../layout/form/select';
import * as utils                      from '../../utils';

export default class RegisterForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isFetching: PropTypes.object.isRequired
  };

  render() {
    return null;
  }
}
