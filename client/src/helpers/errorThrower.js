import { Toaster } from '../actions/alerts';

export default class ErrorThrower {
  constructor(dispatch, params) {
    this.dispatch = dispatch;
    this.params = params;
    this.toaster = new Toaster(dispatch);
  }

  handleError(err, callback) {
    if (callback && this._performCallback(callback) === false) return;
    if (!err.response) {
      this.handleUnknownError(err);
      return;
    };

    const { response } = err;
    const { toaster } = this;
    const {
      error,
      errors,
      message,
      error_description
    } = response.data;
    const errorFiltered = message || error_description || null;

    if (errors && errors.length) {
      errors.forEach((error, i) => {
        toaster.error(error);
      });
      this._emit(errors);
    } else if (errorFiltered) {
      toaster.error(errorFiltered);
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
    this.toaster.error(errorMsg);
  }

  throwError(err) {
    if (err) {
      this.toaster.error(err);
      this._emit(err);
    }
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

  _performCallback(cb) {
    if (cb && typeof cb === 'function') { return cb(); }
  }
}
