import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { bindActionCreators }          from 'redux';
import { actions as workspaceActions } from '../resources/workspace';
import { 
  getCurrentWorkspace, 
  specifyCurrentWorkspace,
  setupCurrentWorkspace,
  unsetCurrentWorkspace }              from '../actions/workspaces'
import { toaster }                     from '../actions/alerts';
import { logout }                      from '../actions/auth';
import Header                          from '../components/layout/header/header';

@connect(
  state => ({
    workspaces: state.workspaces.rest.items || [],
    currentWorkspace: state.workspaces.app.currentWorkspace
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

  componentDidMount() {
    const { dispatch } = this.context.store;
    this.fetchWorkspaces();
  }

  componentWillReceiveProps(newProps) {
    const { workspaces, actions } = newProps;

    if (!workspaces.length && actions.getCurrentWorkspace()) {
      actions.unsetCurrentWorkspace();
    }
  }

  fetchWorkspaces() {
    const { actions, currentWorkspace } = this.props;
    const { dispatch } = this.context.store;

    actions.fetchWorkspaces()
      .then(res => {
        const currentWorkspaceNewest = actions.getCurrentWorkspace(res.body);

        if (!currentWorkspaceNewest) {
          actions.setupCurrentWorkspace(res.body[0]);
        } else if (!currentWorkspace) {
          actions.specifyCurrentWorkspace(currentWorkspaceNewest);
        }
      })
      .catch(err => {
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
            { React.cloneElement(this.props.children, { dispatch }) }
          </div>
        </div>
      </div>
    );
  }
}
