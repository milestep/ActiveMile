import { combineReducers }                  from 'redux'
import { reducers as workspaceReducers }    from '../resources/workspaces';
import { reducers as counterpartyReducers } from '../resources/counterparties';
import { reducers as articleReducers }      from '../resources/articles';
import workspaces                           from './workspaces';

const apiReducers = {
  workspaces: combineReducers({
    rest: workspaceReducers,
    app: workspaces
  }),
  counterparties: counterpartyReducers,
  articles: articleReducers,
}

export default apiReducers;
