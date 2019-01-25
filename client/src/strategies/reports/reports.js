import { Filter, InjectProps } from '../../lib/filter'
import moment                  from 'moment'
import _                       from 'lodash'

export default class ReportsStrategy {
  constructor(props) {
    this.props  = props

    this.filter = new Filter({
      name: 'reports',
      action: props.action,
      filters: this.componentFilters()
    })

    this.emit = props.events
    this.Filter = this.createRenderFilter()
    this.primaryFilterName = this.primaryFilterName()
  }

  createRenderFilter() {
    var { component, props } = this.renderComponent(),
        defaults = { strategy: this },
        newProps = _.merge({}, defaults, props)

    return InjectProps(component, newProps)
  }

  injectStrategy(component) {
    return InjectProps(component, { strategy: this })
  }

  getFilters() {
    return this.filter.getFilters()
  }

  updateFilters(filters) {
    this.filter.updateFilters(filters)
  }

  updatePrimaryFilter(filter) {
    this.updateFilters({
      [this.primaryFilterName]: filter
    })
  }

  getPrimaryFilter() {
    return this.getFilters()[this.primaryFilterName]
  }

  getAppliedFilters(options = {}) {
    var defaults = { pluck: null },
        filters = this.getFilters(),
        appliedFilters = {}

    options = _.assign({}, defaults, options)

    for (var name in filters) {
      var filter = filters[name]

      appliedFilters[name] = []

      filter.forEach(item => {
        if (!item.applied) return
        var { pluck } = options

        if (pluck && _.isString(pluck) && item[pluck]) {
          item = item[pluck]
        }

        appliedFilters[name].push(item)
      })
    }

    // console.log(this.filter)

    return appliedFilters
  }

  getPrimaryAppliedFilters() {
    return this.getAppliedFilters()[this.primaryFilterName]
  }

  onDataReceived() {
    this._mergeYears()
  }

  getStore() {
    return this.props.action.getState()
  }

  getCurrentFilterByValue(date) {
    var filter = this.getPrimaryFilter()
    return filter.find(item => (item.value == date))
  }


  /*
   * Events
   */
  onTabClick(id) {
    var filters = this.getPrimaryFilter()
    var newFilters = _.assign([], filters)

    newFilters[id].applied = !filters[id].applied

    this.updatePrimaryFilter(newFilters)
    this.emit.onFilterChange()
  }

  onSelectChange(e) {
    var year = e.value
    var filters = this.getFilters()['year']
    var newFilters = _.assign([], filters)

    for (var i = 0; i < filters.length; i++) {
      var item = filters[i]
      var newItem = newFilters[i]

      if (item.value == year) {
        newItem.applied = true
      } else if (item.applied) {
        newItem.applied = false
      }
    }

    this.updateFilters({ year: newFilters })
    this.emit.onFilterChange()
  }


  /*
   * Abstract methods
   */
  componentFilters() {
    throw new Error("Component filters must be present")
  }

  primaryFilter() {
    throw new Error("Primary filter must be specified")
  }

  renderComponent() {
    throw new Error("'renderComponent' method must be implemented in strategy")
  }
}
