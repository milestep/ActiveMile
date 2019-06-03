import { Filter }              from '../../lib/filter'
import moment                  from 'moment'
import _                       from 'lodash'
import React, { Component }    from 'react'
import MonthsFilter            from '../../components/reports/filters/months'

export default class ReportsStrategy {
  constructor(props) {
    this.props  = props

    this.filter = new Filter({
      name: 'reports',
      action: props.action,
      filters: this.componentFilters() // ./month.js MonthsStrategy extends ReportsStrategy
    })

    this.emit = props.events
    this.Filter = this.createRenderFilter()
    this.primaryFilterName = this.primaryFilterName()
    this.curMonth = false
  }

  getCurMonth() {
    return this.curMonth
  }

  createRenderFilter() {
    var defaults = { strategy: this },
        newProps = _.merge({}, defaults, this.props),
        ComposedComponent = MonthsFilter

    return class extends Component {
      render() {
        return(
          <ComposedComponent {...this.props} {...newProps} />
        )
      }
    }
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

        if (pluck == 'value' && item[pluck]) {
          item = item[pluck]
        }

        appliedFilters[name].push(item)
      })
    }

    //возвращаю только один месяц
    appliedFilters['curMonth'] = this.curMonth

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

    filters[id].applied = !filters[id].applied
    this.curMonth = filters[id]
    this.updatePrimaryFilter(filters) //что это делает??
    this.emit.onFilterChange()
  }

  onSelectChange(e) {
    var year = e.value
    var filters = this.getFilters()['year']

    for (var i = 0; i < filters.length; i++) {
      var item = filters[i]
      var newItem = filters[i]

      if (item.value == year) {
        newItem.applied = true
      } else if (item.applied) {
        newItem.applied = false
      }
    }

    this.updateFilters({ year: filters })
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
