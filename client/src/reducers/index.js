import auth           from './auth'
import alerts         from './alerts'
import subscriptions  from './subscriptions'
import registers      from './registers'
import apiReducers    from './api'
import filterReducers from './filters'

export default {
  auth,
  alerts,
  subscriptions,
  registers,
  ...filterReducers,
  ...apiReducers
}
