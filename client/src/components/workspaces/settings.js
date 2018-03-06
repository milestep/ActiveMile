import React, { Component } from 'react';

export default class WorkspaceSettings extends Component {
  componentDidMount () {
    let id = this.props.params.id;
  };

  render() {
    return (
      <div className="container">
        <h3>Workspace settings</h3>

        <div className='col-xs-4'>
          <p>Enable sales</p>
        </div>

        <div className='col-xs-1'>
          <input type="checkbox" />
        </div>
      </div>
    );
  }
}
