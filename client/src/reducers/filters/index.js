import { combineReducers } from 'redux'
import reports             from './reports'

const filtersReducers = {
  filters: combineReducers({ reports })
}

export default filtersReducers
