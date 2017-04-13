import 'babel-polyfill';
import React               from 'react'
import { render }          from 'react-dom';
import { browserHistory }  from 'react-router';
import { 
  syncHistoryWithStore, 
  routerMiddleware }       from 'react-router-redux'
import { AppContainer }    from 'react-hot-loader';
import { setAuthHeader }   from './actions/auth'
import { getCurrentUser }  from './utils/currentUser';
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
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./containers/root', () => {
    const NewRoot = require('./containers/root').default;

    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
