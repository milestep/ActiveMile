import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import WorkspacesListItem              from './list/item';

@connect(
  state => ({
    workspaces: state.workspaces.rest.items || []
  })
)
export default class WorkspacesList extends Component {
  static propTypes = {
    methods: PropTypes.object.isRequired,
    workspaces: PropTypes.array.isRequired
  };

  render() {
    const {
      editedWorkspace,
      workspaces, 
      methods,
    } = this.props;

    if (!workspaces && !workspaces.length) { return null }

    let workspacesList = [];

    workspaces.forEach((workspace, i) => {
      const { id } = workspace;
      const isEdited = editedWorkspace === id ? true : false;

      workspacesList.unshift(
        <WorkspacesListItem 
          key={i}
          index={i}
          workspace={workspace}
          isEdited={isEdited}
          methods={methods}
        />
      );
    });

    return(
      <ul className="list-group workspaces-container">
        {workspacesList}
      </ul>
    );
  }
}
