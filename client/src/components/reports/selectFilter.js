import React, { Component } from 'react'
import Select               from 'react-select'

export default class SelectFilter extends Component {
  onSelectChange(e) {
    this.props.onSelectChange(e)
  }

  getOptions() {
    var { filters } = this.props,
        current = new Date().getFullYear(),
        selectOptions = []

    filters.forEach(item => {
      if (item.applied) current = item.value
      selectOptions.push({
        value: item.value,
        label: item.name.toString()
      })
    })

    return { current, selectOptions }
  }

  render() {
    var { current, selectOptions } = this.getOptions()

    return(
      <div className='reports-filter-block'>
        <Select
          name='years'
          className='reports-filter-select'
          onChange={e => this.onSelectChange(e)}
          options={selectOptions}
          value={current}
        />
      </div>
    )
  }
}
