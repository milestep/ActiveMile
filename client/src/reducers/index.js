import auth        from './auth';
import alerts      from './alerts';
import apiReducers from './api'

export default { 
  auth,
  alerts,
  ...apiReducers
}
