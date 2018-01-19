export class ActionCreator {
  constructor(props) {
    this.dispatch       = props.dispatch
    this.defaultPayload = { name: props.name }
    this.createActions  = this.createActions.bind(this)
  }

  createActions(actions, callbacks) {
    var activeActions = {}

    this.actions = actions
    this.callbacks = callbacks

    for (var actionName in actions) {
      activeActions[actionName] = this.createAction(actionName)
    }

    return activeActions
  }

  createAction(actionName) {
    return (actionName => {
      return filters => {
        this._hook('beforeAction', actionName)
        this._dispatchAction(actionName, filters)
        this._hook('afterAction', actionName)
      }
    })(actionName)
  }

  _dispatchAction(actionName, filters) {
    var payload = _.merge({}, this.defaultPayload, { filters })
    this.dispatch({ type: this.actions[actionName], payload })
  }

  _hook(hookName, actionName) {
    if (!this._isHookPresent(hookName)) return

    var cbOptions = this.callbacks[hookName]
    var actionNames = cbOptions[1]
    var callback = cbOptions[0]

    if (actionNames) {
      var ruleType = Object.keys(actionNames)[0]
      var includesMethod = actionNames[ruleType]
                           .includes(actionName)

      if ((ruleType == 'only' && !includesMethod) ||
          (ruleType == 'except' && includesMethod)) return
    }

    callback()
  }

  _isHookPresent(hookName) {
    var { callbacks } = this
    return (callbacks &&
            callbacks.constructor == Object &&
            callbacks[hookName])
  }
}
