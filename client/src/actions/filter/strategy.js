export default class FilterStrategy {
  createComponentFilter(value, name = value, applied = false) {
    return { value, name, applied }
  }

  /*
   * Abstract methods
   */
  defaultFilters() { return null }

  componentFilters() { return null }
}
