import React, { Component, PropTypes } from 'react';
import { bindActionCreators }          from 'redux';
import { connect }                     from 'react-redux';
import { getCurrentUser }              from '../../utils/currentUser';
import { toaster }                     from '../../actions/alerts';
import { setupCurrentWorkspace }       from '../../actions/workspaces';
import { actions as workspaceActions } from '../../resources/workspace';
import WorkspaceForm                   from './form';

@connect(
  state => ({
    workspaces: state.workspaces.rest.items,
    isFetching: state.workspaces.rest.isFetching,
    currentWorkspace: state.workspaces.app.currentWorkspace
  }), 
  dispatch => ({
    actions: bindActionCreators({
      ...workspaceActions,
      setupCurrentWorkspace,
      toaster
    }, dispatch)
  })
)
export default class Workspaces extends Component {
  static propTypes = {
    workspaces: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      workspaces: [ ...props.workspaces ],
      currentWorkspace: props.currentWorkspace,
      editedWorkspaces: []
    };

    this.toaster = props.actions.toaster();
    this.handleSave = this.handleSave.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { workspaces, currentWorkspace } = newProps;

    if (workspaces !== this.state.workspaces) {
      this.setState({
        workspaces: workspaces
      });
    }

    if (currentWorkspace !== this.state.currentWorkspace) {
      this.setState({
        currentWorkspace: currentWorkspace
      });
    }
  }

  handleSave = workspace => {
    return new Promise((resolve, reject) => {
      const { actions } = this.props;
      const { workspaces } = this.state;

      actions.createWorkspace({ workspace })
        .then(res => {
          if (!workspaces.length)  {
            actions.setupCurrentWorkspace(res.body);
          }
          this.toaster.success('Workspace has been created');
          resolve(res);
        })
        .catch(err => {
          this.toaster.error('Could not create workspace!');
          reject(err);
        });
    })
  }

  handleUpdate = (workspace, params) => {
    return new Promise((resolve, reject) => {
      const { actions } = this.props;
      const { currentWorkspace } = this.state;
      const { id } = workspace;
      const { index } = params;

      delete workspace.id;

      actions.updateWorkspace({ id, workspace })
        .then(res => {
          let { workspaces } = this.state;

          if (currentWorkspace.id === res.body.id) {
            actions.setupCurrentWorkspace(res.body);
          }
          workspaces.splice(index, 0, workspaces.shift());
          this.props.dispatch({ type: '@@resource/WORKSPACE/FETCH',
                                status: 'resolved',
                                body: workspaces });
          this.toggleEdited(id, false);
          this.toaster.success('Workspace has been updated');
          resolve(res);
        })
        .catch(err => {
          this.toaster.error('Could not update workspace!');
          reject(err);
        });
    })
  }

  switchToSpace = id => {
    this.setState((prevState) => ({
      ...prevState,
      activeSpace: id
    }));
  }

  setupCurrentWorkspace = (workspace) => {
    const { actions } = this.props;

    actions.setupCurrentWorkspace(workspace);
  }

  toggleEdited(id, status) {
    const { editedWorkspaces } = this.state;
    let newEditedWorkspaces = editedWorkspaces;

    if (status && (!editedWorkspaces.length || editedWorkspaces)) {
      newEditedWorkspaces.push(id);
    } else if (!status) {
      let index = editedWorkspaces.indexOf(id);

      if (index !== -1) {
        newEditedWorkspaces.splice(index, 1);
      }
    }

    this.setState({
      editedWorkspaces: newEditedWorkspaces
    });
  }

  deleteWorkspace(id) {
    const { actions, currentWorkspace } = this.props;

    actions.deleteWorkspace(id)
      .then(res => {
        if (id === currentWorkspace.id) {
          const { workspaces } = this.state;
          actions.setupCurrentWorkspace(workspaces[workspaces.length - 1]);
        }
      })
      .catch(err => {
        this.toaster.error('Could not delete workspace!');
      })
  }

  createWorkspacesListContainer(currentUser) {
    const { workspaces, editedWorkspaces } = this.state;
    const { currentWorkspace } = this.props; // TODO: MOVE IT INTO STATE

    if (!workspaces && !workspaces.length) { return null }

    let workspacesList = [];

    workspaces.forEach((workspace, i) => {
      const { id, title } = workspace;
      const isCurrent = (currentWorkspace && currentWorkspace.id) === id ? true : false;
      const isEdited = editedWorkspaces.includes(id) ? true : false;

      workspacesList.unshift(
        <li className="list-group-item" key={i}>
          { isEdited ? 
            <div className="inline-form">
              <WorkspaceForm
                index={i}
                editing={true}
                workspace={workspace}
                handleSave={this.handleUpdate}
              />
              <div className="form-btn-wrap">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={this.toggleEdited.bind(this, id, false)}
                >
                  <i class="fa fa-times" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          :
            <div className="workspace-overlap">
              <div className="workspace-info">
                <span className="workspace-title">
                  {title}&nbsp;
                </span>
                { isCurrent ? <span class="label label-primary">Current</span> : null }
              </div>
              
              <div className="workspace-actions btn-group">
                { !isCurrent ?
                  <button
                    className="btn btn-sm btn-success"
                    onClick={this.setupCurrentWorkspace.bind(this, workspace)}
                  >
                    Select
                  </button>
                : null }
                { currentUser ? 
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.toggleEdited.bind(this, id, true)}
                  >
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                 : null }
                { currentUser ? 
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={this.deleteWorkspace.bind(this, id)}
                  >
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                : null }
              </div>
            </div>
          }
        </li>
      );
    });

    return(
      <ul className="list-group workspaces-container">
        {workspacesList}
      </ul>
    );
  }

  render() {
    const currentUser = getCurrentUser();
    const workspacesListContainer = this.createWorkspacesListContainer(currentUser);

    return(
      <div>
        <h3>Workspaces</h3>

        <div className="row">

          <div className="col-md-7">
            { workspacesListContainer }
          </div>

          { currentUser ?
            <div className="col-md-5">
              <WorkspaceForm 
                handleSave={this.handleSave}
              />
            </div>
          : null }

        </div>
      </div>
    );
  };
}
