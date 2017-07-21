import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { getCurrentUser }                 from '../../../helpers/currentUser';
import { setupCurrentWorkspace }          from '../../../actions/workspaces';
import { actions as workspaceAppActions } from '../../../actions/workspaces';
import { actions as workspaceActions }    from '../../../resources/workspaces';
import WorkspaceForm                      from '../form';

@connect(
  state => ({
    isUpdating: state.workspaces.rest.isUpdating,
    currentWorkspace: state.workspaces.app.current
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...workspaceActions,
      ...workspaceAppActions
    }, dispatch)
  })
)
export default class WorkspacesListItem extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    methods: PropTypes.object.isRequired,
    workspace: PropTypes.object.isRequired,
    isEdited: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired
  };

  render() {
    const currentUser = getCurrentUser();
    const {
      index,
      workspace,
      isEdited,
      isUpdating,
      methods,
      currentWorkspace,
      actions
    } = this.props;
    const { id, title } = workspace;

    const isCurrent = currentWorkspace && (currentWorkspace.id === id) ? true : false;

    return(
      <li className="list-group-item" key={index}>
        { isEdited ?
          <div className="inline-form">
            <WorkspaceForm
              index={index}
              editing={true}
              fetching={isUpdating}
              workspace={workspace}
              handleSubmit={methods.handleUpdate}
            />
            <div className="form-btn-wrap">
              <button
                className="btn btn-sm btn-primary"
                onClick={methods.toggleEdited.bind(this, id, false)}
              >
                <i class="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        :
          <div className="tabs-overlap">
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
                  onClick={actions.setupCurrentWorkspace.bind(this, workspace)}
                >
                  Select
                </button>
              : null }
              { currentUser ?
                <button
                  className="btn btn-sm btn-primary"
                  onClick={methods.toggleEdited.bind(this, id, true)}
                >
                  <i class="fa fa-pencil" aria-hidden="true"></i>
                </button>
              : null }
              { currentUser ?
                <button
                  className="btn btn-sm btn-danger"
                  onClick={methods.deleteWorkspace.bind(this, id)}
                >
                  <i class="fa fa-times" aria-hidden="true"></i>
                </button>
              : null }
            </div>
          </div>
        }
      </li>
    );
  }
}
