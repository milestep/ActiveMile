import _ from 'lodash'

export default class FilterStrategy {
  constructor() {
    this._initializeFilters()
  }

  getFilters(type = 'component') {
    var filters = this._filters

    if (_.isString(type)) return filters[type]
    return _.assign({}, filters.default, filters.component)
  }

  createComponentFilter(value, name = value, applied = false) {
    return { value, name, applied }
  }

  /*
   * Private methods
   */
  _initializeFilters() {
    this._filters = {
      default: this._handleFilters(this.defaultFilters()),
      component: this._handleFilters(this.componentFilters())
    }
  }

  _handleFilters(filters) {
    if (filters && filters.constructor == Object) return filters
    throw new Error('strategy filter must be an object')
  }

  /*
   * Abstract methods
   */
  defaultFilters() { return null }

  componentFilters() { return null }
}
