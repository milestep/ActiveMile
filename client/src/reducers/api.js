import { combineReducers }               from 'redux'
import { reducers as workspaceReducers } from '../resources/workspace';
import workspaces                        from './workspaces';

const apiReducers = {
  workspaces: combineReducers({
    rest: workspaceReducers,
    app: workspaces
  })
}

export default apiReducers;
