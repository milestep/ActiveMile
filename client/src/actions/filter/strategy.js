export default class FilterStrategy {
  getFilters() {
    return {
      default: this.defaultFilters(),
      component: this.componentFilters()
    }
  }

  createComponentFilter(value, name = value, applied = false) {
    return { value, name, applied }
  }

  checkComponentFilters(filters) {
    if (!filters || filters.constructor != Object) {
      throw new Error("'componentFilters' method must return an object")
    }
  }

  handleFilters(inputFilters = {}) {
    var newFilters = {}
    var filters = {}

    if (filters = inputFilters.component) {
      this.checkComponentFilters(filters)
      newFilters['component'] = filters
    }

    if (filters = inputFilters.default) {
      newFilters['default'] = filters || null
    }

    return newFilters
  }

  /*
   * Abstract methods
   */
  defaultFilters() {
    return null
  }

  componentFilters() {
    throw new Error("'componentFilters' method should be created")
  }
}
