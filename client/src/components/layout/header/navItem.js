import React, { PropTypes } from 'react';
import { Link, State }      from 'react-router';
import classNames           from 'classnames';

export default class NavItem extends React.Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    to: PropTypes.string.isRequired
  }

  render() {
    const { active, ...props } = this.props;

    return (
      <li className={classNames({ active })}>
        <Link {...props} activeClassName="" />
      </li>
    );
  }
}
