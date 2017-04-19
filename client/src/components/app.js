import React, { PropTypes }     from 'react';
import { connect }              from 'react-redux';
import { bindActionCreators }   from 'redux';
import Header                   from '../components/layout/header/header';
import { 
  actions as workspaceActions 
}                               from '../resources/workspace';
import { 
  getCurrentWorkspace, 
  specifyCurrentWorkspace,
  setupCurrentWorkspace }       from '../actions/workspaces'
import { toaster }              from '../actions/alerts';
import { logout }               from '../actions/auth';

@connect(
  state => ({
    auth: state.auth,
    alertsAsync: state.alerts.alertsAsync,
    workspaces: state.workspaces.rest.items,
    currentWorkspace: state.workspaces.app.currentWorkspace
  }), 
  dispatch => ({
    actions: bindActionCreators({
      ...workspaceActions,
      getCurrentWorkspace,
      setupCurrentWorkspace,
      specifyCurrentWorkspace,
      toaster
    }, dispatch)
  })
)
export default class App extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    alertsAsync: PropTypes.array.isRequired,
    children: PropTypes.element.isRequired
  };

  static contextTypes = {
    router: PropTypes.object,
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      workspaces: [ ...props.workspaces ],
      currentWorkspace: props.currentWorkspace
    }

    this.toaster = props.actions.toaster();
  }

  componentDidMount() {
    const { dispatch } = this.context.store;
    this.fetchWorkspaces();
  }

  componentWillReceiveProps(newProps) {
    const { workspaces } = newProps;

    if (workspaces !== this.state.workspaces) {
      this.setState({
        workspaces: workspaces
      });
    }
  }

  fetchWorkspaces() {
    const { actions, currentWorkspace } = this.props;
    const { dispatch } = this.context.store;

    actions.fetchWorkspaces()
      .then(res => {
        const currentWorkspaceNext = actions.getCurrentWorkspace();

        if (!currentWorkspaceNext) {
          actions.setupCurrentWorkspace(res.body[0]);
        } else if (!currentWorkspace) {
          actions.specifyCurrentWorkspace(currentWorkspaceNext);
        }
      })
      .catch(err => {
        this.toaster.error('Could not load workspaces!');
      })
  }

  render() {
    const { auth } = this.props;
    const { dispatch } = this.context.store;

    return (
      <div className="site-wrapper">
        <Header
          loggedIn={!!auth.token}
          router={this.context.router}
          alertsAsync={this.props.alertsAsync}
          workspaces={this.props.workspaces}
          currentWorkspace={this.props.currentWorkspace}
          setupCurrentWorkspace={this.props.actions.setupCurrentWorkspace}
          {...bindActionCreators({ logout }, dispatch)}
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
