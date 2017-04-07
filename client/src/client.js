import 'babel-polyfill';
import React             from 'react'
import { render }        from 'react-dom';
import { Provider }      from 'react-redux';
import { 
  Router, 
  Route, 
  IndexRedirect, 
  browserHistory }       from 'react-router'
import { 
  syncHistoryWithStore, 
  routerMiddleware }     from 'react-router-redux'
import configureStore    from './store/configureStore'
import RequireAuth       from './containers/requireAuth';
import AdminScope        from './containers/adminScope';
import GuestScope        from './containers/guestScope';
import App               from './components/app';
import NotFound          from './components/errors/err404';
import Dashboard         from './components/dashboard';
import Login             from './components/auth/login';
import './styles/app.styl';

const middleware = routerMiddleware(browserHistory)
const store = configureStore(null, middleware)
const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRedirect to="admin" />

        <Route component={RequireAuth(GuestScope, false)}>
          <Route path="login" component={Login} />
        </Route>

        <Route path="admin" component={RequireAuth(AdminScope)}>
          <IndexRedirect to="dashboard" />
          <Route path="dashboard" component={Dashboard} />
        </Route>

        <Route path='*' component={NotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
