import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import { bindActionCreators }   from 'redux';
import Header                   from '../components/layout/header/header';
import { logout }               from '../actions/auth';
import { addAlertAsync }        from '../actions/alerts';

@connect(state => ({
  auth: state.auth,
  alertsAsync: state.alerts.alertsAsync
}))
export default class App extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    alertsAsync: PropTypes.array.isRequired,
    children: PropTypes.element.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object,
    store: React.PropTypes.object
  };

  render() {
    const { auth, dispatch } = this.props;
    const authMsg = auth.message;

    return (
      <div className="site-wrapper">
        <Header
          loggedIn={!!auth.token}
          router={this.context.router}
          alertsAsync={this.props.alertsAsync}
          {...bindActionCreators({ logout }, dispatch)}
        />

        <div className="site-container">
          <div className="container">
            {React.cloneElement(this.props.children, { dispatch: dispatch })}
          </div>
        </div>
      </div>
    );
  }
}
