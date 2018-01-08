import React, { Component, PropTypes } from 'react'

export default class Filter extends Component {
  onTabClick(e, index) {
    e.preventDefault()
    this.props.onTabClick(index)
  }

  getTabs() {
    var { filters } = this.props
    return this.props.filters.map((filter, index) => (
      <li key={index} className={filter.applied ? 'active' : ''}>
        <a href='#' onClick={(e) => { this.onTabClick(e, index) }}>
          { filter.name }
        </a>
      </li>
    ))
  }

  render() {
    return(
      <div className='reports-filter'>
        <ul class='nav nav-pills reports-filter-months-tabs'>
          { this.getTabs() }
        </ul>
      </div>
    )
  }
}
