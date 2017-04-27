import { combineReducers }               from 'redux'
import { reducers as workspaceReducers } from '../resources/workspace';
import { reducers as counterpartyReducers } from '../resources/counterparty';
import workspaces                        from './workspaces';

const apiReducers = {
  workspaces: combineReducers({
    rest: workspaceReducers,
    app: workspaces
  }),
  counterparties: counterpartyReducers
}

export default apiReducers;
