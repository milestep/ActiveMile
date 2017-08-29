import React               from 'react';
import { render }          from 'react-dom';
import { browserHistory }  from 'react-router';
import {
  syncHistoryWithStore,
  routerMiddleware }       from 'react-router-redux'
import { setAuthHeader }   from './actions/auth'
import { getCurrentUser }  from './helpers/currentUser';
import configureStore      from './store/configureStore'
import Root                from './containers/root';
import faviconUrl          from 'file-loader!./images/favicon.ico';
import './styles/app.js';

const middleware = routerMiddleware(browserHistory);
const store = configureStore(null, middleware);
const history = syncHistoryWithStore(browserHistory, store);
const currentUser = getCurrentUser();

document.querySelector('[rel="shortcut icon"]').href = faviconUrl;

if (currentUser) { setAuthHeader(currentUser) }

render(
  <Root store={store} history={history} />,
  document.getElementById('app')
);
