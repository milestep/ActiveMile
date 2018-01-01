import auth              from './auth'
import alerts            from './alerts'
import subscriptions     from './subscriptions'
import registers         from './registers'
import apiReducers       from './api'
import filtersReducers   from './filters/index'

export default {
  auth,
  alerts,
  subscriptions,
  registers,
  ...filtersReducers,
  ...apiReducers
}
