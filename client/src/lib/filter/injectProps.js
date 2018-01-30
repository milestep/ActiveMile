import React, { Component } from 'react'

export function InjectProps(ComposedComponent, newProps) {
  return class extends Component {
    render() {
      return(
        <ComposedComponent {...this.props} {...newProps} />
      )
    }
  }
}
