import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { browserHistory }              from 'react-router';
import RequireAuth                     from './requireAuth';

export default function (WrappedComponent) {
  @connect(state => ({
    currentWorkspace: state.workspaces.app.current,
    isFetching: state.workspaces.app.fetching,
    isResolved: state.workspaces.app.resolved
  }))
  @RequireAuth
  class WorkspaceDependencies extends Component {
    createRenderBody() {
      const { currentWorkspace, isResolved, isFetching } = this.props;

      if (currentWorkspace && isResolved) {
        return <WrappedComponent {...this.props} />
      } else if (!currentWorkspace && isResolved) {
        return <div>There is no any workspace specified...</div>
      } else if (isFetching) {
        return (
          <span className="spin-wrap main-loader">
            <i class="fa fa-spinner fa-spin fa-3x"></i>
          </span>
        );
      }
    }

    render() {
      return this.createRenderBody();
    }
  }

  return WorkspaceDependencies;
}
