import { createResource } from 'redux-rest-resource';

export const { types, actions, reducers } = createResource({
  name: 'features',
  url: `${window.location.origin}/api/v1/features/:id?:params`,
  actions: {
    update: {
      assignResponse: true
    }
  }
});
