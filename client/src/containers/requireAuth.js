import React, { Component }  from 'react';
import { connect }           from 'react-redux';
import { browserHistory }    from 'react-router';
import Login             from '../components/auth/login'

export default function() {
  const arg = arguments[0];

  if (arg && typeof arg === 'function') {
    return _requireAuth(arg, arguments[1]);
  }

  return function(WrappedComponent) {
    return _requireAuth(WrappedComponent, arg);
  }
}

function _requireAuth(WrappedComponent, reqireAuth=true) {
  @connect(state => ({
    authenticated: state.auth.token
  }))
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
      const { authenticated } = this.props;

      return(
        <div>
          { authenticated ?
            <WrappedComponent {...this.props} /> :
            <Login {...this.props} />
          }
        </div>
      )
    }
  }

  return Authentication;
}
