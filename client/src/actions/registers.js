import { bindActionCreators }             from 'redux';
import { Toaster }                        from './alerts';
import { actions as subscriptionActions } from './subscriptions';
import { actions as registerActions }     from '../resources/register';
import * as utils                         from '../utils';

export const actions = {
  loadRegisters: function() {
    return function(dispatch) {
      const model = 'registers';
      const toaster = new Toaster(dispatch);
      const _actions = bindActionCreators({
        ...subscriptionActions,
        ...registerActions,
      }, dispatch);

      _actions.moveToPending(model);

      _actions.fetchRegisters()
        .then(res => _actions.resolve(model))
        .catch(err => {
          _actions.resolve(model);
          if (utils.debug) console.error(err);
          toaster.error(`Could not load ${model}!`);
        });
    }
  }
}
