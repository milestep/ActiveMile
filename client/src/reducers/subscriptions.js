import SubscriptionActions from '../constants/subscriptions';

const {
  SUBSCRIBE,
  UNSUBSCRIBE,
  SUBSCRIPTION_FETCHING,
  SUBSCRIPTION_RESOLVE,
  SUBSCRIPTION_RESET
} = SubscriptionActions;

const initialState = {
  articles: {
    qty: 0,
    fetching: false,
    resolved: false
  },
  counterparties: {
    qty: 0,
    fetching: false,
    resolved: false
  },
  registers: {
    qty: 0,
    fetching: false,
    resolved: false
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SUBSCRIBE: {
      let nextState = state;

      action.payload.forEach((model, i) => {
        if (state[model] != undefined) {
          nextState[model]['qty']++;
        }
      });

      return { ...state, ...nextState };
    }

    case UNSUBSCRIBE: {
      let nextState = state;

      action.payload.forEach((model, i) => {
        if (state[model] != undefined) {
          nextState[model]['qty']--;
        }
      });

      return { ...state, ...nextState };
    }

    case SUBSCRIPTION_FETCHING: {
      const model = action.payload;

      return {
        ...state,
        [model]: {
          ...state[model],
          fetching: true,
          resolved: false
        }
      };
    }

    case SUBSCRIPTION_RESOLVE: {
      const model = action.payload;

      return {
        ...state,
        [model]: {
          ...state[model],
          fetching: false,
          resolved: true
        }
      };
    }

    case SUBSCRIPTION_RESET: {
      let nextState = state;

      for (let i in nextState) {
        nextState[i]['resolved'] = false;
      }

      return nextState;
    }

    default: {
      return state;
    }
  }
}
