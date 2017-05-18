import { bindActionCreators }             from 'redux';
import { Toaster }                        from './alerts';
import { actions as subscriptionActions } from './subscriptions';
import { actions as counterpartyActions } from '../resources/counterparty';
import * as utils                         from '../utils';

export const actions = {
  loadCounterparties: function() {
    return function(dispatch) {
      const model = 'counterparties';
      const toaster = new Toaster(dispatch);
      const _actions = bindActionCreators({
        ...subscriptionActions,
        ...counterpartyActions,
      }, dispatch);

      _actions.moveToPending(model);

      _actions.fetchCounterpartys()
        .then(res => _actions.resolve(model))
        .catch(err => {
          _actions.resolve(model);
          if (utils.debug) console.error(err);
          toaster.error(`Could not load ${model}!`);
        });
    }
  }
}
