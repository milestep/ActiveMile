import React, { Component } from 'react'
import TapFilter            from '../tapFilter'

export default class YearsFilter extends Component {
  constructor(props) {
    super(props)

    var strategy = props.strategy
    this.onTabClick = strategy.onTabClick.bind(strategy)
  }

  render() {
    var { strategy } = this.props
    var filters = strategy.getFilters()

    return(
      <div>
        <TapFilter
          filters={filters.year}
          onTabClick={this.onTabClick}
        />
      </div>
    )
  }
}
