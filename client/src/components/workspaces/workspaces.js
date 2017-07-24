import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { getCurrentUser }                 from '../../helpers/currentUser';
import { toaster }                        from '../../actions/alerts';
import { setupCurrentWorkspace }          from '../../actions/workspaces';
import { actions as workspaceActions }    from '../../resources/workspaces';
import { actions as workspaceAppActions } from '../../actions/workspaces';
import WorkspacesList                     from './list';
import WorkspaceForm                      from './form';
import * as utils                         from '../../utils';

@connect(
  state => ({
    workspaces: state.workspaces.rest.items,
    isCreating: state.workspaces.rest.isCreating,
    currentWorkspace: state.workspaces.app.current
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...workspaceActions,
      ...workspaceAppActions,
      toaster
    }, dispatch)
  })
)
export default class Workspaces extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    workspaces: PropTypes.array.isRequired,
    isCreating: PropTypes.bool.isRequired
  };

  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      workspaces: [ ...props.workspaces ],
      editedWorkspace: false
    };

    this.toaster = props.actions.toaster();
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.toggleEdited = this.toggleEdited.bind(this);
    this.deleteWorkspace = this.deleteWorkspace.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { workspaces } = newProps;

    if (workspaces !== this.state.workspaces) {
      this.setState({
        workspaces: workspaces
      });
    }
  }

  handleCreate = workspace => {
    return new Promise((resolve, reject) => {
      const { actions } = this.props;
      const { workspaces } = this.state;

      actions.createWorkspace({ workspace })
        .then(res => {
          if (utils.empty(workspaces))  {
            actions.setupCurrentWorkspace(res.body);
          }
          this.toaster.success('Workspace has been created');
          resolve(res);
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          this.toaster.error('Could not create workspace!');
          reject(err);
        });
    })
  }

  handleUpdate = (workspace, params) => {
    return new Promise((resolve, reject) => {
      const { actions, dispatch, currentWorkspace } = this.props;
      const { store } = this.context;
      const { id } = workspace;
      const { index } = params;

      delete workspace.id;

      actions.updateWorkspace({ id, workspace })
        .then(res => {
          let { workspaces } = this.props;

          if (currentWorkspace.id === res.body.id) {
            actions.setupCurrentWorkspace(res.body);
          }
          workspaces.splice(index, 0, workspaces.shift());
          store.dispatch({ type: '@@resource/WORKSPACE/FETCH',
                           status: 'resolved',
                           body: workspaces });
          this.toggleEdited(id, false);
          this.toaster.success('Workspace has been updated');
          resolve(res);
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          this.toaster.error('Could not update workspace!');
          reject(err);
        });
    })
  }

  deleteWorkspace(id) {
    if (confirm("Are you sure?")) {
      const { actions, workspaces, currentWorkspace } = this.props;

      actions.deleteWorkspace(id)
        .then(res => {
          const { workspaces } = this.props;

          if (currentWorkspace && !utils.empty(workspaces) && id === currentWorkspace.id) {
            actions.setupCurrentWorkspace(workspaces[workspaces.length - 1]);
          }
          this.toaster.success('Workspace was deleted!');
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          this.toaster.error('Could not delete workspace!');
        })
    }
  }

  toggleEdited(id, status) {
    let { editedWorkspaces } = this.state;

    if (status) {
      editedWorkspaces = id;
    } else {
      editedWorkspaces = false;
    }

    this.setState({
      editedWorkspace: editedWorkspaces
    });
  }

  switchToSpace = id => {
    this.setState((prevState) => ({
      ...prevState,
      activeSpace: id
    }));
  }

  render() {
    const currentUser = getCurrentUser();
    const { isCreating } = this.props;
    const { editedWorkspace } = this.state;
    const {
      toggleEdited, handleUpdate, deleteWorkspace
    } = this;
    const methods = {
      toggleEdited, handleUpdate, deleteWorkspace
    }

    return(
      <div className="container">
        <h3>Workspaces</h3>

        <div className="row">

          <div className="col-md-8">
            <WorkspacesList
              editedWorkspace={editedWorkspace}
              methods={methods}
            />
          </div>

          { currentUser ?
            <div className="col-md-4">
              <WorkspaceForm
                fetching={isCreating}
                handleSubmit={this.handleCreate}
              />
            </div>
          : null }

        </div>
      </div>
    );
  };
}
