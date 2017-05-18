import { bindActionCreators }             from 'redux';
import { Toaster }                        from './alerts';
import { actions as subscriptionActions } from './subscriptions';
import { actions as articleActions }      from '../resources/article';
import * as utils                         from '../utils';

export const actions = {
  loadArticles: function() {
    return function(dispatch) {
      const model = 'articles';
      const toaster = new Toaster(dispatch);
      const _actions = bindActionCreators({
        ...subscriptionActions,
        ...articleActions,
      }, dispatch);

      _actions.moveToPending(model);

      _actions.fetchArticles()
        .then(res => _actions.resolve(model))
        .catch(err => {
          _actions.resolve(model);
          if (utils.debug) console.error(err);
          toaster.error(`Could not load ${model}!`);
        });
    }
  }
}
