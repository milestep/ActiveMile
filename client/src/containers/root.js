import React, {
  Component,
  PropTypes }                from 'react';
import { Provider }          from 'react-redux';
import {
  Router,
  Route,
  IndexRedirect }            from 'react-router';
import {
  App,
  Login,
  Workspaces,
  Articles,
  Inventory,
  Holiday,
  Counterparties,
  Registers,
  RegistersEditor,
  Reports,
  ReportsOld,
  Charts,
  Features,
  InventoryItemsEditor,
  HolidaysItemsEditor,
  NotFound,
  Forecast,
  BackReports }              from '../components';
import requireAuth           from '../containers/requireAuth';
import RequireWorkspace      from '../containers/requireWorkspace';

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  render() {
    const { store, history } = this.props;
    const routes = (
      <Route path="/" component={App}>
        <IndexRedirect to="registers" />
    
        <Route path="login" component={requireAuth(Login, false)} />
        <Route path="workspaces" component={requireAuth(Workspaces)} />
        <Route path="inventory" component={requireAuth(Inventory)} />
        <Route path="inventory/:id/edit" component={requireAuth(InventoryItemsEditor)} />
        <Route path="holidays" component={(Holiday)} />
        <Route path="holidays/:id/edit" component={requireAuth(HolidaysItemsEditor)} />
        <Route path="/features/:id/" component={RequireWorkspace(Features)} />
        <Route path="articles" component={RequireWorkspace(Articles)} />
        <Route path="counterparties" component={RequireWorkspace(Counterparties)} />
        <Route path="registers" component={RequireWorkspace(Registers, {update: () => {this.forceUpdate()}})} />
        <Route path="registers/:id/edit" component={RequireWorkspace(RegistersEditor)} />
        <Route path="reports_by_months" component={RequireWorkspace(Reports, { strategy: 'months' })} />
        <Route path="reports_by_years" component={RequireWorkspace(Reports, { strategy: 'years' })} />
        <Route path="reports_old" component={RequireWorkspace(ReportsOld)} />
        <Route path="charts" component={RequireWorkspace(Charts)} />
        <Route path="forecast" component={RequireWorkspace(Forecast)} />
        <Route path="reports/months" component={BackReports} store={store}/>
        <Route path='*' component={NotFound} />
      </Route>
    );

    return(
      <Provider store={store}>
        <Router key={Math.random()} routes={routes} history={history} />
      </Provider>
    )
  }
}
