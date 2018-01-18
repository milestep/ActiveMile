import React, { Component } from 'react'
import Select               from 'react-select'

export default class SelectFilter extends Component {
  onSelectChange(e) {
    this.props.onSelectChange(e)
  }

  render() {
    var { filters } = this.props
    var options = []
    var current = new Date().getFullYear()

    filters.forEach(item => {
      if (item.applied) current = item.value
      options.push({
        value: item.value,
        label: item.name.toString()
      })
    })

    return(
      <div className='reports-filter-block'>
        <Select
          name='years'
          className='reports-filter-select'
          onChange={e => this.onSelectChange(e)}
          options={options}
          value={current}
        />
      </div>
    )
  }
}
