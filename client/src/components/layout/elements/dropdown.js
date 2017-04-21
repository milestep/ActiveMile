import React, { Component } from 'react';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  toggleOpen(status) {
    this.setState({
      open: status
    });
  }

  render() {
    const { title, list } = this.props;
    const { open } = this.state;

    return(
      <li className={`dropdown dropdown-hover${open ? ' open' : ''}`}>
        <a 
          href="#"
          className="dropdown-toggle"
          onClick={e => e.preventDefault()}
          onMouseEnter={() => {this.toggleOpen(true)}}
          onMouseLeave={() => {this.toggleOpen(false)}}
        >
          { title }
          <span className="caret"></span>
        </a>
        <ul 
          className="dropdown-menu" 
          onClick={() => {this.toggleOpen(false)}}
          onMouseEnter={() => {this.toggleOpen(true)}}
          onMouseLeave={() => {this.toggleOpen(false)}}
        >
          { list }
        </ul>
      </li>
    );
  }
}
