import React, { 
  Component, 
  PropTypes, 
  createClass }            from 'react';
import { connect }         from 'react-redux';
import { browserHistory }  from 'react-router'

const ComposedComponent = createClass({
  render: function() {
    return this.props.children;
  }
});

export default function (reqireAuth = true) {
  class Authentication extends Component {
    static contextTypes = {
      router: PropTypes.object
    };

    componentWillMount() {
      const { router } = this.context;
      const { authenticated } = this.props;

      if (reqireAuth && !authenticated) {
        browserHistory.push('/login');
      } else if (!reqireAuth && authenticated) {
        browserHistory.push('/admin');
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
