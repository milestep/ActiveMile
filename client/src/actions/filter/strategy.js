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
