import auth           from './auth'
import alerts         from './alerts'
import subscriptions  from './subscriptions'
import registers      from './registers'
import apiReducers    from './api'
import filterReducers from './filters'
import features       from './features'
import inventory      from './inventory'
import holidays       from './holidays'

export default {
  auth,
  alerts,
  subscriptions,
  registers,
  features,
  inventory,
  holidays,
  ...filterReducers,
  ...apiReducers
}
