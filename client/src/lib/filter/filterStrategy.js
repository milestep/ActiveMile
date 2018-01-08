export class FilterStrategy {
  filterBy(name) {
    this.filterBy = name
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
    throw new Error("'componentFilters' method should be created in your strategy")
  }
}
