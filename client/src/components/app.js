import React, { Component, PropTypes }    from 'react';
import { connect }                        from 'react-redux';
import { bindActionCreators }             from 'redux';
import { getCurrentUser }                 from '../helpers/currentUser';
import { actions as workspaceActions }    from '../resources/workspaces';
import { actions as workspaceAppActions } from '../actions/workspaces';
import { toaster }                        from '../actions/alerts';
import { logout }                         from '../actions/auth';
import Header                             from '../components/layout/header/header';
import * as utils                         from '../utils';

@connect(
  state => ({
    workspaces: state.workspaces.rest.items,
    currentWorkspace: state.workspaces.app.current
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...workspaceActions,
      ...workspaceAppActions,
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

    if (utils.empty(workspaces)) {
      if (actions.getCurrentWorkspace()) {
        actions.unsetCurrentWorkspace();
      }
      this.fetchWorkspaces();
    }
  }

  fetchWorkspaces() {
    const currentUser = getCurrentUser();
    const { actions } = this.props;

    if (!currentUser) return;

    actions.loadWorkspaces();
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
          <div className="container-fluid">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}
