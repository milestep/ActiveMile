import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { browserHistory }              from 'react-router';
import RequireAuth                     from './requireAuth';

class ComposedComponent extends Component {
  render() {
    return this.props.children;
  }
}

export default function (WrappedComponent) {
  @connect(state => ({
    authenticated: state.auth.token,
    currentWorkspace: state.workspaces.app.current,
    isFetching: state.workspaces.app.fetching,
    isResolved: state.workspaces.app.resolved
  }))
  class WorkspaceDependencies extends Component {
    componentWillMount() {
      if (!this.props.authenticated) {
        browserHistory.push('/login');
      }
    }

    createRenderBody() {
      const { authenticated, currentWorkspace, isResolved, isFetching } = this.props;

      if (!authenticated) {
        return <ComposedComponent { ...this.props } />
      }

      if (currentWorkspace && isResolved) {
        return <WrappedComponent {...this.props} />
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

      return <ComposedComponent { ...this.props } />
    }

    render() {
      return this.createRenderBody();
    }
  }

  return WorkspaceDependencies;
}
