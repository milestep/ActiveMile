import { combineReducers } from 'redux'
import reports             from './reports'

const filterReducers = {
  filters: combineReducers({ reports })
}

export default filterReducers
