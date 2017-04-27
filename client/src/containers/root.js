import React, { 
  Component, 
  PropTypes }       from 'react';
import { Provider } from 'react-redux';
import { 
  Router, 
  Route, 
  IndexRedirect }   from 'react-router';
import RequireAuth  from '../containers/requireAuth';
import App          from '../components/app';
import Workspaces   from '../components/workspaces/workspaces';
import Counterparties   from '../components/counterparties/counterparties';
import Login        from '../components/auth/login';
import NotFound     from '../components/errors/err404';

const routes = (
  <Route path="/" component={App}>
    <IndexRedirect to="workspaces" />
    
    <Route component={RequireAuth(false)}>
      <Route path="login" component={Login} />
    </Route>

    <Route component={RequireAuth()}>
      <IndexRedirect to="workspaces" />
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
