import { createResource } from 'redux-rest-resource';

export const { types, actions, reducers } = createResource({
  name: 'inventory',
  url: `${window.location.origin}/api/v1/inventory_items/:id?:params`,
  actions: {
    update: {
      assignResponse: true
    }
  }
});
