import { combineReducers }               from 'redux'
import { reducers as workspaceReducers } from '../resources/workspace';
import { reducers as articleReducers }   from '../resources/article';
import workspaces                        from './workspaces';

const apiReducers = {
  workspaces: combineReducers({
    rest: workspaceReducers,
    app: workspaces
  }),
  articles: articleReducers
}

export default apiReducers;
