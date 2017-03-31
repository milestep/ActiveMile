import React               from 'react';
import { connect }         from 'react-redux';
import { browserHistory }  from 'react-router'

export default function (ComposedComponent, req=true) {
  class Authentication extends React.Component {
    static contextTypes = {
      router: React.PropTypes.object
    };

    componentWillMount() {
      const { router } = this.context;
      const { authenticated } = this.props;

      if (req && !authenticated) {
        browserHistory.push('/login');
      } else if (!req && authenticated) {
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
