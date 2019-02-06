import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import NavItem                         from './navItem';
import Dropdown                        from '../elements/dropdown';

@connect(
  state => ({
    loggedIn: !!state.auth.token,
    alertsAsync: state.alerts.alertsAsync,
    workspaces: state.workspaces.rest.items,
    currentWorkspace: state.workspaces.app.current
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
      collapsed: true,
      listNavItems: [],
      listForecast:[],
      listReports: [],
      listNavAfterReports: [],
      listNavItemsRight: []
    };

    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  handleLogout = e => {
    const {logout, router} = this.props;
    e.preventDefault();
    logout(router);
  }

  toggleCollapse() {
    const collapsed = !this.state.collapsed;
    this.setState({collapsed});
  }

  createNavItems(navItems, isActive) {
    return navItems.map((props) =>
      <NavItem key={props.to} to={props.to} active={isActive(props.to)} onClick={props.onClick}>
        {props.title}
      </NavItem>
    );
  }

  componentDidMount() {

    let dataNavItem = [], dataNavAfterReports = [], dataNavItemsRight = [], dataReports = [], dataForecast = [];

    if (this.props.loggedIn) {

      dataNavItem.push({
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
      });

      dataForecast.push({
        to: '/forecast',
        title: 'Forecast',
        onClick: this.toggleCollapse
      });

      dataReports.push({
        to: 'reports_by_months',
        title: 'Monthly',
        onClick: this.toggleCollapse
      }, {
        to: '/reports_by_years',
        title: 'By year',
        onClick: this.toggleCollapse
      });

      dataNavAfterReports.push(
        {
          to: '/inventory',
          title: 'Inventory',
          onClick: this.toggleCollapse
        }, {
          to: '/holidays',
          title: 'Holidays',
          onClick: this.toggleCollapse
        });

      dataNavItemsRight.push({
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
      })
      this.setState({listNavItems: dataNavItem,
        listForecast: dataForecast,
        listReports: dataReports,
        listNavAfterReports: dataNavAfterReports,
        listNavItemsRight: dataNavItemsRight})
    } else {
      dataNavAfterReports.push({
        to: '/holidays',
        title: 'Holidays',
        onClick: this.toggleCollapse
      });

      dataNavItemsRight.push({
        to: '/login',
        title: 'Login',
        onClick: this.toggleCollapse
      })
      this.setState({listNavAfterReports: dataNavAfterReports, listNavItemsRight: dataNavItemsRight})
    }

  }

  renderNavBar() {
    const isActive = this.props.router.isActive.bind(this.props.router);

    let navItems = this.createNavItems(this.state.listNavItems, isActive);
    let reports = this.createNavItems(this.state.listReports, isActive);
    let forecast = this.createNavItems(this.state.listForecast, isActive);
    let navAfterReports = this.createNavItems(this.state.listNavAfterReports, isActive);
    let navItemsRight = this.createNavItems(this.state.listNavItemsRight, isActive);

    let workspacesList = this.props.workspaces.map((workspace, i) => {
      return (
        <li key={i}>
          <a href="#"
             onClick={e => {
               e.preventDefault();
               this.props.setupCurrentWorkspace(workspace);
             }}
          >
            {workspace.title}
          </a>
        </li>
      );
    });

    if (this.props.loggedIn) {
      navItems.push(<Dropdown key='999' title='Reports' list={reports}/>);

      return (
        <nav className="site-nav">
          <ul className="nav navbar-nav"><Dropdown title='Accounting' list={navItems}/></ul>
          <ul className="nav navbar-nav"><Dropdown title='Utils' list={navAfterReports}/></ul>
          <ul className="nav navbar-nav"> {forecast} </ul>
          <ul className="nav navbar-nav navbar-right"> {navItemsRight} </ul>

          {(this.props.currentWorkspace) &&
          <ul className="nav navbar-nav navbar-main"><Dropdown title={this.props.currentWorkspace.title} list={workspacesList}/>
          </ul>}
        </nav>
      );
    } else return (
      <nav className="site-nav">
        <ul className="nav navbar-nav navbar-right"> {navItemsRight} </ul>
      </nav>
    )
  }

  render() {
    const {alertsAsync} = this.props;
    const navClass = this.state.collapsed ? "collapse" : "";
    let alertsContainer;

    if (alertsAsync && alertsAsync.length) {
      alertsContainer = alertsAsync.map((alert, i) => {
        return (
          <div className={`alert alert-${alert.kind}`} key={i}>
            {alert.message}
          </div>
        );
      });
    }

    return (
      <header className="site-header">
        <nav className="navbar navbar-inverse" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" onClick={this.toggleCollapse}>
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

        {(alertsAsync && alertsAsync.length) ?

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
