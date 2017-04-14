import auth        from './auth';
import alerts      from './alerts';
// import workspaces  from './workspaces';
import { apiReducers } from './api'

export default { 
  auth,
  alerts,
  /*workspaces,*/
  ...apiReducers
}
