import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { browserHistory }              from 'react-router';

export default function (WrappedComponent) {
  @connect(
    state => ({
      currentWorkspace: state.workspaces.app.current,
      isFetching: state.workspaces.app.fetching,
      isResolved: state.workspaces.app.resolved
    })
  )
  class WorkspaceDependencies extends Component {
    createRenderContent() {
      const { currentWorkspace, isResolved, isFetching } = this.props;

      if (currentWorkspace && isResolved) {
        return <WrappedComponent {...this.props} />
      } else if (!currentWorkspace && isResolved) {
        return <div>There is no workspace specified...</div>
      } else if (isFetching) {
        return <div>Fetching...</div>
      }
    }

    render() {
      return this.createRenderContent();
    }
  }

  return WorkspaceDependencies;
}