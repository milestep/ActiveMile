import { combineReducers }                  from 'redux'
import { reducers as workspaceReducers }    from '../resources/workspaces';
import { reducers as counterpartyReducers } from '../resources/counterparties';
import { reducers as articleReducers }      from '../resources/articles';
import { reducers as registerReducers }     from '../resources/registers';
import workspaces                           from './workspaces';

const apiReducers = {
  workspaces: combineReducers({
    rest: workspaceReducers,
    app: workspaces
  }),
  counterparties: counterpartyReducers,
  articles: articleReducers,
  registers: registerReducers,
}

export default apiReducers;
