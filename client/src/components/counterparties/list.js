import React, { Component, PropTypes } from 'react';

export default class List extends Component {
  static propTypes = {
    counterparties: PropTypes.array.isRequired,
    handleDestroy: PropTypes.func.isRequired
  };

  renderItems() {  
    const { counterparties } = this.props;

    return counterparties.map((item, i) => {
      return (
        <li className="list-group-item li_height hover1 for_icons" key={i}> 
          <div className="col-md-6">{ item.name }</div>
          <div className="col-md-2">{ item.type }</div>
          <div className="col-md-2">{ item.date } </div>
          <div className="col-md-2 text-right hover2">
            <span 
              onClick={this.props.handleDestroy.bind(this, item.id)} 
              className="glyphicon glyphicon-trash"
              title="Delete">
            </span>  
          </div>
        </li>
      );
    });
  }

  render() {
    return(
      <div>
        <ul className="list-group">
          {this.renderItems()}
        </ul>
      </div>
    );
  }
}
