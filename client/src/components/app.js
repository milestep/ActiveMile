import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { bindActionCreators }          from 'redux';
import { getCurrentUser }              from '../helpers/currentUser';
import { actions as workspaceActions } from '../resources/workspace';
import {
  getCurrentWorkspace, 
  specifyCurrentWorkspace,
  setupCurrentWorkspace,
  unsetCurrentWorkspace }              from '../actions/workspaces'
import { toaster }                     from '../actions/alerts';
import { logout }                      from '../actions/auth';
import Header                          from '../components/layout/header/header';
import * as utils                      from '../utils';

@connect(
  state => ({
    workspaces: state.workspaces.rest.items,
    currentWorkspace: state.workspaces.app.current
  }), 
  dispatch => ({
    actions: bindActionCreators({
      ...workspaceActions,
      getCurrentWorkspace,
      setupCurrentWorkspace,
      specifyCurrentWorkspace,
      unsetCurrentWorkspace,
      toaster,
      logout
    }, dispatch)
  })
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    workspaces: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object,
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.toaster = props.actions.toaster();
  }

  componentWillMount() {
    this.fetchWorkspaces();
  }

  componentWillReceiveProps(newProps) {
    const { workspaces, actions } = newProps;

    if (utils.empty(workspaces) && actions.getCurrentWorkspace()) {
      actions.unsetCurrentWorkspace();
      this.fetchWorkspaces();
    }
  }

  fetchWorkspaces() {
    const currentUser = getCurrentUser();

    if (!currentUser) return;

    const { actions } = this.props;
    const prevWorkspace = this.props.currentWorkspace;

    actions.fetchWorkspaces()
      .then(res => {
        const currentWorkspace = actions.getCurrentWorkspace(res.body);
        const workspaces = res.body[0];

        if (!workspaces) return;

        if (!currentWorkspace) {
          actions.setupCurrentWorkspace(workspaces);
        } else if (!prevWorkspace) {
          actions.specifyCurrentWorkspace(currentWorkspace);
        }
      })
      .catch(err => {
        if (utils.debug) console.error(err);
        this.toaster.error('Could not load workspaces!');
      })
  }

  render() {
    const { actions, logout } = this.props;
    const { store, router } = this.context;
    const { dispatch } = store;

    return (
      <div className="site-wrapper">
        <Header
          router={router}
          logout={actions.logout}
          setupCurrentWorkspace={actions.setupCurrentWorkspace}
        />

        <div className="site-container">
          <div className="container">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}
