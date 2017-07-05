import React, {
  Component,
  PropTypes,
  createClass }            from 'react';
import { connect }         from 'react-redux';
import { browserHistory }  from 'react-router';

export default function (ComposedComponent, reqireAuth = true) {
  class Authentication extends Component {
    componentWillMount() {
      const { authenticated } = this.props;

      if (reqireAuth && !authenticated) {
        browserHistory.push('/login');
      } else if (!reqireAuth && authenticated) {
        browserHistory.push('/registers');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { authenticated: state.auth.token };
  }

  return connect(mapStateToProps)(Authentication);
}
