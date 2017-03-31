import AlertsActions from '../constants/alerts';

const { 
  ADD_ALERT_ASYNC, 
  REMOVE_ALERT_ASYNC 
} = AlertsActions;

export default (state={
  alertsAsync: []
}, action) => {

  switch (action.type) {
    case ADD_ALERT_ASYNC: {
      const { message, kind } = action;

      return {
        ...state,
        alertsAsync: [ ...state.alertsAsync, { message, kind } ]
      }
    }

    case REMOVE_ALERT_ASYNC: {
      let newAlertsAsync = state.alertsAsync.slice(1);

      return {
        ...state,
        alertsAsync: newAlertsAsync
      }
    }

    default: {
      return state;
    }
  }
};
