import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { 
  fetchWorkspaces,
  createWorkspace }                    from '../../actions/workspaces';
import CreateWorkspaceForm             from './forms/createWorkspace';
import cookie                          from '../../utils/cookie';

@connect(state => ({
  workspaces: state.workspaces.all,
  fetching: state.workspaces.fetching.all,
  fetched: state.workspaces.fetched.all
}), {
  fetchWorkspaces,
  createWorkspace
})
export default class WorkspacesIndex extends Component {
  static propTypes = {
    workspaces: PropTypes.array.isRequired,
    fetching: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired,
    fetchWorkspaces: PropTypes.func.isRequired,
    createWorkspace: PropTypes.func.isRequired
  };

   static contextTypes = {
    router: React.PropTypes.object,
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      workspaces: [],
      activeSpace: null
    };

    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    const { store, router } = this.context;

    return store.dispatch(fetchWorkspaces(router));
  }

  componentWillReceiveProps(newProps) {
    const { workspaces } = newProps;

    if (workspaces !== this.state.workspaces) {
      this.setState({
        workspaces: workspaces
      });
    }
  }

  handleSave = workspace => {
    this.props.createWorkspace(workspace);
  }

  switchToSpace = id => {
    this.setState((prevState) => ({
      ...prevState,
      activeSpace: id
    }));
  }

  render() {
    const { workspaces, activeSpace } = this.state;
    const { fetching, fetched } = this.props;
    
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
          cookie.get('token') ? 
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
