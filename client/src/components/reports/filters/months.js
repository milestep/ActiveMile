import React, { Component } from 'react'
import TapFilter            from '../tapFilter'
import SelectFilter         from '../selectFilter'

export default class MonthsFilter extends Component {
  constructor(props) {
    super(props)

    var strategy = props.strategy
    this.onTabClick = strategy.onTabClick.bind(strategy)
    this.onSelectChange = strategy.onSelectChange.bind(strategy)
  }

  render() {
    var { strategy } = this.props
    var filters = strategy.getFilters()

    return(
      <div>
        <SelectFilter
          filters={filters.year}
          onSelectChange={this.onSelectChange}
        />
        <TapFilter
          filters={strategy.getPrimaryFilter()}
          onTabClick={this.onTabClick}
        />
      </div>
    )
  }
}
