export class FilterStrategy {
  constructor(props) {
    this.filterBy = props.filterBy
    this._filter = null
  }

  setFilter(filter) {
    this._filter = filter
  }

  getFilter() {
    return this._filter
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
