import React, { 
  Component, 
  PropTypes }       from 'react';
import { Provider } from 'react-redux';
import { 
  Router, 
  Route, 
  IndexRedirect }   from 'react-router';
import { 
  App, 
  Login, 
  Workspaces, 
  Articles,
  Counterparties,
  NotFound }        from '../components';
import RequireAuth  from '../containers/requireAuth';

const routes = (
  <Route path="/" component={App}>
    <IndexRedirect to="workspaces" />
    
    <Route component={RequireAuth(false)}>
      <Route path="login" component={Login} />
    </Route>

    <Route component={RequireAuth()}>
      <IndexRedirect to="articles" />
      <Route path="articles" component={Articles} />
      <Route path="workspaces" component={Workspaces} />
      <Route path="counterparties" component={Counterparties} />
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
