import AlertsActions from '../constants/alerts';

const {
  ADD_ALERT_ASYNC,
  REMOVE_ALERT_ASYNC
} = AlertsActions;

export function toaster() {
  return function(dispatch) {
    return new Toaster(dispatch);
  }
}

export class Toaster {
  constructor(dispatch, params) {
    this.dispatch = dispatch;
  }

  success(message, options) {
    this._throwAlert('success', message, options);
  }

  warning(message, options) {
    this._throwAlert('warning', message, options);
  }

  error(message, options) {
    this._throwAlert('danger', message, Object.assign({}, { delay: 6000 }, options));
  }

  _throwAlert(type, message, options = {}) {
    if (!options) { return; }

    const { dispatch } = this;
    const params = Object.assign({}, { delay: 4000 }, options);
    const { delay } = params;

    dispatch({ 
      type: ADD_ALERT_ASYNC,
      kind: type,
      message: message
    });

    setTimeout(() => {
      dispatch({ type: REMOVE_ALERT_ASYNC });
    }, delay);
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
