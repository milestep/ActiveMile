export default class FilterStrategy {
  constructor(props) {
    this._verifyProps(props)
    this._filterBy(props.filterBy)
    this._initializeFilters()
  }

  getFilters(filters = null) {
    var filters = filters || this._filters
    var rawFilters = []

    filters.forEach((filter, i) => {
      if (filter.applied) {
        rawFilters.push(filter.value)
      }
    })

    return Object.assign({}, this._defaultFilters, {
      [this._filterBy]: rawFilters
    })
  }

  getComponentFilters(filters = null) {
    return filters || this._filters
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
  _verifyProps(props) {
    if (
      !props ||
      typeof props != 'object' ||
      !Object.keys(props).length) {
      throw new Error("Options must be present!")
    }
  }

  _initializeFilters() {
    this._defaultFilters = this.defaultFilters()
    this._filters = this.componentFilters()
  }

  _filterBy(value) {
    if (!value) throw new Error("'filterBy' option must be specified!")
    this._filterBy = value
  }

  /*
   * Abstract methods
   */
  defaultFilters() { return null }

  componentFilters() { return null }
}
