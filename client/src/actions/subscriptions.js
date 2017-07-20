import { bindActionCreators }             from 'redux';
import { defaultHeaders }                 from 'redux-rest-resource';
import { debug, toTitleCase }             from '../utils';
import { Toaster }                        from './alerts';
import SubscriptionActions                from '../constants/subscriptions';

const {
  SUBSCRIBE,
  UNSUBSCRIBE,
  SUBSCRIPTION_FETCHING,
  SUBSCRIPTION_RESOLVE,
  SUBSCRIPTION_RESET
} = SubscriptionActions;

const getFunctionName = model => {
  if (model == 'counterparties')
    model = 'counterpartys'
  return `fetch${toTitleCase(model)}`
}

const needModel = model => {
  return model.qty && !model.resolved && !model.fetching
}

let queue = {
  models: [],
  getCount: () => {
    return queue.models.length
  },
  add: model => {
    const { models } = queue

    if (models.indexOf(model) === -1) {
      models.push(model)
    }
  },
  remove: model => {
    const { models } = queue
    models.splice(models.indexOf(model), 1)
  }
}

export const actions = {
  checkSubscribers(force=false) {
    return function(dispatch, getStore) {
      if (!defaultHeaders['workspace-id']) return;
      if (force) dispatch(actions.reset())

      const store = getStore()
      const toaster = new Toaster(dispatch)
      const models = ['articles', 'counterparties', 'registers']
      const { subscriptions, registers, articles, counterparties } = store

      return new Promise(resolve => {
        models.forEach(model => {
          if (needModel(subscriptions[model])) {
            queue.add(model)

            dispatch(actions.loadModel(model)).then(res => {
              queue.remove(model)

              if (queue.getCount() === 0)
                resolve()
            }).catch(err => {
              queue.remove(model)

              if (queue.getCount() === 0)
                resolve()
            })
          }
        })

        if (queue.getCount() === 0)
          resolve()
      })
    }
  },
  loadModel: function(model) {
    return function(dispatch) {
      dispatch(actions.moveToPending(model))

      const resource = require(`../resources/${model}`)
      const resourceActions = bindActionCreators(resource.actions, dispatch)
      const toaster = new Toaster(dispatch)

      return new Promise(resolve => {
        resourceActions[getFunctionName(model)]()
          .then(res => {
            resolve(model)
            dispatch(actions.resolve(model))
          })
          .catch(err => {
            if (debug) console.error(err)
            resolve(model)
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

      return new Promise(resolve => {
        dispatch(actions.checkSubscribers())
          .then(() => resolve())
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
