import { createResource } from 'redux-rest-resource';

export const { types, actions, reducers } = createResource({
  name: 'workspace',
  url: `${window.location.origin}/api/v1/workspaces/:id`,
  actions: {
    update: {
      assignResponse: true
    }
  }
});
