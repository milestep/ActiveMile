import { createResource } from 'redux-rest-resource';

export const { types, actions, reducers } = createResource({
  name: 'counterparty',
  url: `${window.location.origin}/api/v1/counterparties/:id?:params`,
  actions: {
    update: {
      assignResponse: true
    }
  }
});
