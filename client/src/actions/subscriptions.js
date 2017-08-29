import { bindActionCreators }   from 'redux';
import { defaultHeaders }       from 'redux-rest-resource';
import { debug, toTitleCase }   from '../utils';
import { Toaster }              from './alerts';
import SubscriptionActions      from '../constants/subscriptions';

const {
  SUBSCRIBE,
  UNSUBSCRIBE,
  SUBSCRIPTION_FETCHING,
  SUBSCRIPTION_RESOLVE,
  SUBSCRIPTION_RESET
} = SubscriptionActions

export const actions = {
  subscribe: function(models) {
    return function(dispatch) {
      return new Promise((resolve, reject) => {
        dispatch({ type: SUBSCRIBE, payload: models })

        dispatch(actions.fetchSubscriptions())
          .then(() => resolve())
          .catch(err => reject(err))
      })
    }
  },
  unsubscribe: function(models) {
    return function(dispatch) {
      dispatch({ type: UNSUBSCRIBE, payload: models });
    }
  },
  fetchSubscriptions(force=false) {
    return function(dispatch, getStore) {
      if (!defaultHeaders['workspace-id']) return
      if (force) dispatch(resetSubscriptions())

      const store = getStore()
      const models = ['articles', 'counterparties']

      return Promise.all(models.map(model => {
        if (needModel(store.subscriptions[model])) {
          return dispatch(loadModel(model))
        }
      }))
    }
  }
}

// Hidden Actions
function loadModel(model) {
  return function(dispatch) {
    dispatch(moveToPending(model))

    const resource = require(`../resources/${model}`)
    const resourceActions = bindActionCreators(resource.actions, dispatch)
    const toaster = new Toaster(dispatch)

    return new Promise((resolve, reject) => {
      resourceActions[getFunctionName(model)]()
        .then(res => {
          resolve(model)
          dispatch(resolveSubscriptions(model))
        })
        .catch(err => {
          if (debug) console.error(err)
          reject({ ...err, model })
          dispatch(resolveSubscriptions(model))
          toaster.error(`Could not load ${model}!`)
        })
      })
  }
}

function moveToPending(model) {
  return function(dispatch) {
    dispatch({ type: SUBSCRIPTION_FETCHING, payload: model })
  }
}

function resolveSubscriptions(model) {
  return function(dispatch) {
    dispatch({ type: SUBSCRIPTION_RESOLVE, payload: model });
  }
}

function resetSubscriptions() {
  return function(dispatch) {
    dispatch({ type: SUBSCRIPTION_RESET });
  }
}

// Helpers
function needModel(model) {
  return model.qty && !model.resolved && !model.fetching
}

function getFunctionName(model) {
  if (model == 'counterparties')
    model = 'counterpartys'
  return `fetch${toTitleCase(model)}`
}
