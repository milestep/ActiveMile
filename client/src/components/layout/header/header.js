import React, { Component, PropTypes } from 'react';
import NavItem                         from './navItem';

export default class Header extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    loggedIn: PropTypes.bool,
    logout: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    
    this.state = {
      collapsed: true,
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
    const { loggedIn } = this.props;
    let navItems = [];
    let navItemsRight = [];


    navItems = [
      { 
        to: '/articles', 
        title: 'Articles', 
        onClick: this.toggleCollapse
      }
    ];

    if (loggedIn) {
      Array.prototype.push.apply(navItems, [{
        to: '/admin/dashboard', 
        title: 'Dashboard', 
        onClick: this.toggleCollapse
      }]);

      Array.prototype.push.apply(navItemsRight, [{
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
    navItemsRight = this.createNavItems(navItemsRight);

    return (
      <nav>
        <ul className="nav navbar-nav">
          {navItems}
        </ul>
        {navItemsRight ? 
          <ul className="nav navbar-nav navbar-right">
            {navItemsRight}
          </ul> : null
        }
      </nav>
    );
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
          <div className="container">
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

          <div className="container">
            <div className="site-notifications">
              {alertsContainer || null}
            </div>
          </div>

        : null}
      </header>
    );
  }
}
