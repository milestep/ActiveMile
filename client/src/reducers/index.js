import auth          from './auth';
import alerts        from './alerts';
import subscriptions from './subscriptions';
import apiReducers   from './api'

export default { 
  auth,
  alerts,
  subscriptions,
  ...apiReducers
}
