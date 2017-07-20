import { createResource } from 'redux-rest-resource';

export const { types, actions, reducers } = createResource({
  name: 'register',
  url: `${window.location.origin}/api/v1/registers/:id?:params`,
  actions: {
    update: {
      assignResponse: true
    }
  }
});
