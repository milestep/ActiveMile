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
  fetchSubscriptions(force=false) {
    return function(dispatch, getStore) {
      if (!defaultHeaders['workspace-id']) return
      if (force) dispatch(actions.reset())

      const store = getStore()
      const models = ['articles', 'counterparties', 'registers']

      return Promise.all(models.map(model => {
        if (needModel(store.subscriptions[model])) {
          return dispatch(actions.loadModel(model))
        }
      }))
    }
  },
  loadModel: function(model) {
    return function(dispatch) {
      dispatch(actions.moveToPending(model))

      const resource = require(`../resources/${model}`)
      const resourceActions = bindActionCreators(resource.actions, dispatch)
      const toaster = new Toaster(dispatch)

      return new Promise((resolve, reject) => {
        resourceActions[getFunctionName(model)]()
          .then(res => {
            resolve(model)
            dispatch(actions.resolve(model))
          })
          .catch(err => {
            if (debug) console.error(err)
            reject({ ...err, model })
            dispatch(actions.resolve(model))
            toaster.error(`Could not load ${model}!`)
          })
        })
    }
  },
  moveToPending: function(model) {
    return function(dispatch) {
      dispatch({ type: SUBSCRIPTION_FETCHING,
                 payload: model });
    }
  },
  resolve: function(model) {
    return function(dispatch) {
      dispatch({ type: SUBSCRIPTION_RESOLVE,
                 payload: model });
    }
  },
  reset: function() {
    return function(dispatch) {
      dispatch({ type: SUBSCRIPTION_RESET });
    }
  },
  subscribe: function(models) {
    return function(dispatch) {
      dispatch({ type: SUBSCRIBE,
                 payload: models });

      return new Promise((resolve, reject) => {
        dispatch(actions.fetchSubscriptions())
          .then(() => resolve())
          .catch(err => reject(err))
      })
    }
  },
  unsubscribe: function(models) {
    return function(dispatch) {
      dispatch({ type: UNSUBSCRIBE,
                 payload: models });
    }
  }
}

function getFunctionName(model) {
  if (model == 'counterparties')
    model = 'counterpartys'
  return `fetch${toTitleCase(model)}`
}

function needModel(model) {
  return model.qty && !model.resolved && !model.fetching
}
