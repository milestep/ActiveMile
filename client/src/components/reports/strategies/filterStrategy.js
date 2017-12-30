export default class FilterStrategy {
  constructor(props) {
    this._initializeFilters()
  }

  getComponentFilters() {
    return this._filters
  }

  getDefaultFilters() {
    return this._defaultFilters
  }

  createComponentFilter(value, name = value, applied = false) {
    return { value, name, applied }
  }

  /*
   * Private methods
   */
  _initializeFilters() {
    this._defaultFilters = this.defaultFilters()
    this._filters = this.componentFilters()
  }

  /*
   * Abstract methods
   */
  defaultFilters() { return null }

  componentFilters() { return null }
}
