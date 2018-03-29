import React, { Component, PropTypes }    from 'react';
import { connect }                        from 'react-redux';
import { bindActionCreators }             from 'redux';
import NavItem                            from './navItem';
import Dropdown                           from '../elements/dropdown';
import { show as fetchCurrentFeatures }   from '../../../actions/features';

@connect(
  state => ({
    loggedIn: !!state.auth.token,
    alertsAsync: state.alerts.alertsAsync,
    workspaces: state.workspaces.rest.items,
    currentWorkspace: state.workspaces.app.current
  }),
  dispatch => ({
    actions: bindActionCreators({
      fetchCurrentFeatures,
    }, dispatch)
  })
)
export default class Header extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    workspaces: PropTypes.array.isRequired,
    logout: PropTypes.func.isRequired,
    setupCurrentWorkspace: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      collapsed: true
    };

    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  handleLogout = e => {
    const { logout, router } = this.props;
    e.preventDefault();
    logout(router);
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;

    this.setState({collapsed});
  }

  createNavItems(navItems) {
    if (!navItems) return;

    const { router } = this.props;
    const isActive = router.isActive.bind(router);

    return navItems.map((props) =>
      <NavItem
        key={props.to}
        to={props.to}
        active={isActive(props.to)}
        onClick={props.onClick}
      >
        {props.title}
      </NavItem>
    );
  }

  renderNavBar() {
    const {
      loggedIn,
      workspaces,
      currentWorkspace,
      setupCurrentWorkspace
    } = this.props;
    let navItems = [];
    let navItemsRight = [];
    let reports = [];
    let workspacesList = [];

    if (loggedIn) {
      Array.prototype.push.apply(navItems, [{
        to: '/articles',
        title: 'Articles',
        onClick: this.toggleCollapse
      }, {
        to: '/counterparties',
        title: 'Counterparties',
        onClick: this.toggleCollapse
      }, {
        to: '/registers',
        title: 'Registers',
        onClick: this.toggleCollapse
      }, {
        to: '/charts',
        title: 'Charts',
        onClick: this.toggleCollapse
      }, {
        to: '/inventory',
        title: 'Inventory',
        onClick: this.toggleCollapse
      }]);

      Array.prototype.push.apply(reports, [{
        to: 'reports_by_months',
        title: 'Monthly',
        onClick: this.toggleCollapse
       }, {
        to: '/reports_by_years',
        title: 'By year',
        onClick: this.toggleCollapse
       }]);

      Array.prototype.push.apply(navItemsRight, [{
        to: '/workspaces',
        title: 'Workspaces',
        onClick: this.toggleCollapse
      }, {
        to: '/logout',
        title: 'Logout',
        onClick: (e) => {
          this.handleLogout(e);
          this.toggleCollapse.call(this);
        }
      }]);
    } else {
      Array.prototype.push.apply(navItemsRight, [{
        to: '/login',
        title: 'Login',
        onClick: this.toggleCollapse
      }]);
    }

    navItems = this.createNavItems(navItems);
    reports = this.createNavItems(reports);
    navItemsRight = this.createNavItems(navItemsRight);
    workspacesList = workspaces.map((workspace, i) => {
      return(
        <li key={i}>
          <a href="#"
            onClick={e => {
              e.preventDefault();

              setupCurrentWorkspace(workspace);
              this.fetchCurrentFeatures(workspace.id);
            }}
          >
            { workspace.title }
          </a>
        </li>
      );
    });

    return (
      <nav className="site-nav">
        { navItems ?
          <ul className="nav navbar-nav">
            { navItems }
          </ul>
        : null }

        { (loggedIn && reports) ?
          <ul className="nav navbar-nav">
            <Dropdown
              title='Reports'
              list={reports}
            />
          </ul>
        : null }

        { navItemsRight ?
          <ul className="nav navbar-nav navbar-right">
            { navItemsRight }
          </ul>
         : null}

        { (loggedIn && currentWorkspace) ?
          <ul className="nav navbar-nav navbar-right">
            <Dropdown
              title={currentWorkspace.title}
              list={workspacesList}
            />
          </ul>
        : null }
      </nav>
    );
  }

  fetchCurrentFeatures(id) {
    const { actions, fetchCurrentFeatures } = this.props;
    actions.fetchCurrentFeatures(id);
  }

  render() {
    const { collapsed } = this.state;
    const { alertsAsync } = this.props;
    const navClass = collapsed ? "collapse" : "";
    let alertsContainer;

    if (alertsAsync && alertsAsync.length) {
      alertsContainer = alertsAsync.map((alert, i) => {
        return(
          <div className={`alert alert-${alert.kind}`} key={i}>
            {alert.message}
          </div>
        );
      });
    }

    return(
      <header className="site-header">
        <nav className="navbar navbar-inverse" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle"
                onClick={this.toggleCollapse}
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className={"navbar-collapse " + navClass} id="bs-example-navbar-collapse-1">
              {this.renderNavBar()}
            </div>
          </div>
        </nav>

        { (alertsAsync && alertsAsync.length) ?

          <div className="container-fluid toaster">
            <div className="site-notifications">
              {alertsContainer || null}
            </div>
          </div>

        : null}
      </header>
    );
  }
}
