import React, { 
  Component, 
  PropTypes }        from 'react';
import { Provider }  from 'react-redux';
import { 
  Router, 
  Route, 
  IndexRedirect, 
  browserHistory }   from 'react-router';
import RequireAuth   from '../containers/requireAuth';
import App           from '../components/app';
import NotFound      from '../components/errors/err404';
import Dashboard     from '../components/dashboard';
import Login         from '../components/auth/login';

const routes = (
  <Route path="/" component={App}>
    <IndexRedirect to="admin" />

    <Route component={RequireAuth(false)}>
      <Route path="login" component={Login} />
    </Route>

    <Route path="admin" component={RequireAuth()}>
      <IndexRedirect to="dashboard" />
      <Route path="dashboard" component={Dashboard} />
    </Route>

    <Route path='*' component={NotFound} />
  </Route>
);

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const { store, history } = this.props;

    return(
      <Provider store={store}>
        <Router key={Math.random()} routes={routes} history={history} />
      </Provider>
    )
  }
}
