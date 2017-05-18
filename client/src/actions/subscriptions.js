import { bindActionCreators }             from 'redux';
import { defaultHeaders }                 from 'redux-rest-resource';
import { Toaster }                        from './alerts';
import SubscriptionActions                from '../constants/subscriptions';
import { actions as articleActions }      from './articles';
import { actions as counterpartyActions } from './counterparties';
import { actions as registerActions }     from './registers';

const {
  SUBSCRIBE,
  UNSUBSCRIBE,
  SUBSCRIPTION_FETCHING,
  SUBSCRIPTION_RESOLVE,
  SUBSCRIPTION_RESET
} = SubscriptionActions;

export const actions = {
  checkSubscribers(force=false) {
    return function(dispatch, getStore) {
      if (!defaultHeaders['workspace-id']) return;

      const _actions = bindActionCreators({
        ...articleActions,
        ...counterpartyActions,
        ...registerActions
      }, dispatch);

      const toaster = new Toaster(dispatch);
      const store = getStore();
      const { subscriptions, registers, articles, counterparties } = store;

      if (force) dispatch(actions.reset());

      if (needModel('registers')) {
        _actions.loadRegisters();
      }

      if (needModel('articles')) {
        _actions.loadArticles();
      }

      if (needModel('counterparties')) {
        _actions.loadCounterparties();
      }

      function needModel(inputModel) {
        const model = subscriptions[inputModel];
        const { qty, fetching, resolved } = model;

        return qty && !resolved && !fetching;
      }
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
  subscribe: function(items) {
    return function(dispatch) {
      dispatch({ type: SUBSCRIBE,
                 payload: items });

      dispatch(actions.checkSubscribers());
    }
  },
  unsubscribe: function(items) {
    return function(dispatch) {
      dispatch({ type: UNSUBSCRIBE,
                 payload: items });
    }
  }
}
