export class ActionCreator {
  constructor(props) {
    this.name         = props.name
    this._dispatch    = props.dispatch
    this.createAction = this.createAction.bind(this)
  }

  createAction(type) {
    if (typeof type != 'string') return null

    return filters => {
      var payload = { name: this.name}

      if (filters) {
        payload['filters'] = filters
      }

      this._dispatch({ type, payload })
    }
  }
}
