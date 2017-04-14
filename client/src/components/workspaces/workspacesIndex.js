import React, { Component, PropTypes } from 'react';
import { bindActionCreators }          from 'redux';
import { connect }                     from 'react-redux';
import { getCurrentUser }              from '../../utils/currentUser';
import Toaster                         from '../../actions/alerts';
import { actions as workspaceActions } from '../../resources/workspace';
import CreateWorkspaceForm             from './createWorkspaceForm';

@connect(
  state => ({
    workspaces: state.workspaces.items,
    isFetching: state.workspaces.isFetching
  }), 
  dispatch => ({
    actions: bindActionCreators({...workspaceActions}, dispatch)
  })
)
export default class WorkspacesIndex extends Component {
  static propTypes = {
    workspaces: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      workspaces: [],
      activeSpace: null
    };

    this.toaster = new Toaster(props.dispatch);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    const { actions, dispatch } = this.props;

    actions.fetchWorkspaces()
      .catch(err => {
        this.toaster.error('Could not load workspaces!');
      })
  }

  componentWillReceiveProps(newProps) {
    const { workspaces } = newProps;

    if (workspaces !== this.state.workspaces) {
      this.setState({
        workspaces: workspaces
      });
    }
  }

  handleSave = (workspace, callback) => {
    const { actions } = this.props;

    actions.createWorkspace({ workspace })
      .then(res => {
        if (res.status == 'resolved') {
          this.toaster.success('Workspace has been created');
          if (typeof callback === 'function') { callback(); }
        }
      })
      .catch(err => {
        this.toaster.error('Could not create workspace!');
      })
  }

  switchToSpace = id => {
    this.setState((prevState) => ({
      ...prevState,
      activeSpace: id
    }));
  }

  render() {
    const currentUser = getCurrentUser();
    const { workspaces, activeSpace } = this.state;
    const { isFetching } = this.props;
    
    let workspacesTabsList = [], 
        workspacesTabsContent = [];

    if (workspaces && workspaces.length) {
      workspaces.forEach((workspace, i) => {
        let { id, title } = workspace;
        let listClassName = '',
            contentClassName = '';

        if ((i === 0 && !activeSpace) || id === activeSpace) {
          listClassName = 'active';
          contentClassName = 'active in';
        }

        workspacesTabsList.push(
          <li className={listClassName} key={i}>
            <a onClick={this.switchToSpace.bind(this, id)}>{title}</a>
          </li>
        );

        workspacesTabsContent.push(
          <div className={`tab-pane fade${' ' + contentClassName}`} key={i}>
            <p>Articles List {i + 1}</p>
          </div>
        );
      });
    }

    return(
      <div>
        <h3>Articles</h3>

        {
          currentUser ? 
          <div className="row">
            <div className="col-md-6">
              <CreateWorkspaceForm 
                handleSave={this.handleSave}
              />
            </div>
          </div> : null
        }

        {
          (workspaces && workspaces.length) ? 
          <div className="row">
            <div className="col-md-12">
              <div className="workspaces-container">
                <ul class="nav nav-tabs">
                  {workspacesTabsList}
                </ul>
                <div className="tab-content">
                  {workspacesTabsContent}
                </div>
              </div>
            </div>
          </div> : null
        }
      </div>
    );
  };
}
