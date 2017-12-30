import React, { Component, PropTypes } from 'react'
import Filter                          from './filter'

export default class Filters extends Component {
  getFilters() {
    var { filters } = this.props
    var components = []

    for (let filterName in filters) {
      components.push(
        <Filter
          key={filterName}
          filterName={filterName}
          filters={filters[filterName]}
          onTabClick={this.props.onTabClick}
        />
      )
    }

    return components
  }

  render() {
    return(
      <div className='reports-filters'>
        { this.getFilters() }
      </div>
    )
  }
}
