import React, {
  Component,
  PropTypes }            from 'react';
import { Provider }      from 'react-redux';
import {
  Router,
  Route,
  IndexRedirect }        from 'react-router';
import {
  App,
  Login,
  Workspaces,
  Articles,
  Counterparties,
  Registers,
  RegistersEditor,
  Reports,
  Charts,
  NotFound }             from '../components';
import requireAuth       from '../containers/requireAuth';
import RequireWorkspace  from '../containers/requireWorkspace';

const routes = (
  <Route path="/" component={App}>
    <IndexRedirect to="registers" />

    <Route path="login" component={requireAuth(Login, false)} />
    <Route path="workspaces" component={requireAuth(Workspaces)} />
    <Route path="articles" component={RequireWorkspace(Articles)} />
    <Route path="counterparties" component={RequireWorkspace(Counterparties)} />
    <Route path="registers" component={RequireWorkspace(Registers)} />
    <Route path="registers/:id/edit" component={RequireWorkspace(RegistersEditor)} />
    <Route path="reports" component={RequireWorkspace(Reports)} />
    <Route path="charts" component={RequireWorkspace(Charts)} />
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
