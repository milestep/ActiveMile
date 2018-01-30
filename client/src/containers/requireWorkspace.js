import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { browserHistory }              from 'react-router';
import requireAuth                     from './requireAuth';

export default function(WrappedComponent, options) {
  @connect(state => ({
    authenticated: state.auth.token,
    currentWorkspace: state.workspaces.app.current,
    isFetching: state.workspaces.app.fetching,
    isResolved: state.workspaces.app.resolved
  }))
  @requireAuth()
  class WorkspaceDependencies extends Component {
    createRenderBody() {
      const { authenticated, currentWorkspace, isResolved, isFetching } = this.props;

      if (currentWorkspace && isResolved) {
        let params = Object.assign({}, this.props, options)
        return <WrappedComponent { ...params } />
      }

      if (!currentWorkspace && isResolved) {
        return(
          <div>
            There is no any workspace specified...
          </div>
        );
      }

      if (isFetching) {
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
