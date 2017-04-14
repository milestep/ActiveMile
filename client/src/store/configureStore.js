import { createStore, applyMiddleware, combineReducers } from 'redux'
import appReducers from '../reducers'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { routerReducer } from 'react-router-redux'

export default function configureStore(initialState, middleware) {
  let middlewares = [thunk, middleware];
  
  if (process.env.NODE_ENV == 'development') {
    const logger = createLogger()
    middlewares.push(logger);
  }

  const reducers = {
    ...appReducers,
    initialState,
    routing: routerReducer
  }

  const reducer = combineReducers(reducers)
  const store = createStore(reducer, applyMiddleware(...middlewares))

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    });
  }

  return store;
}
