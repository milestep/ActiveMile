import { addAlertAsync } from '../actions/alerts';

export default class ErrorThrower {
  constructor(dispatch, params) {
    this.dispatch = dispatch;
    this.params = params;
  }

  handleError(err, callback) {
    if (callback && this._performCallback(callback) === false) { return; }

    const { response } = err;
    const { 
      error,
      errors, 
      message, 
      error_description 
    } = response.data;

    let errorFiltered = (
      message || 
      error_description || 
      (error ? this._getDoorkeeperError(error, response.status) : null)
    );

    if (errors && errors.length) {
      errors.forEach((error, i) => {
        this._throwAlert(error)
      });
      this._emit(errors);
    } else if (errorFiltered) {
      this._throwAlert(errorFiltered);
      this._emit(errorFiltered);
    } else {
      return Promise.reject(err);
    }
  }

  handleUnknownError(err, callback) {
    const { dispatch, params: { type, payload } } = this;
    let errorMsg = 'Unknown error occured! Please, try again later.';

    this._performCallback(callback);
    this._emit(err);
    this._throwAlert(errorMsg);
  }

  _emit(error) {
    const { dispatch, params: { type, payload } } = this;

    let resPayload = { error };

    if (dispatch && type) {
      if (payload) {
        for (let i in payload) {
          resPayload[i] = payload[i];
        }
      }

      type ? dispatch({ type, payload: resPayload }) : null;
    }
  }

  _throwAlert(message) {
    addAlertAsync({
      message, 
      type: 'danger',
      delay: 6000
    })(this.dispatch);
  }

  _performCallback(cb) {
    if (cb && typeof cb === 'function') { return cb(); }
  }

  _getDoorkeeperError(error, status) {
    let message = error;

    switch (status) {
      case 401: {
        return 'You should to login before continuing';
      }
      default: {
        return message;
      }
    } 
  }
}
