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
        <div key={i}>
          <li className="list-group-item">
            <div className="counterparty-overlap">
              <div className="col-md-10">
                <div className="counterparty-overlap">
                  <span className="col-md-6">{ item.name }</span>
                  <span className="col-md-3">{ item.type }</span>
                  <span className="col-md-3">{ item.date }</span>
                </div>
              </div>
              <div className="col-md-1 col-xs-offset-1">
                <div className="btn-group">
                  <button className="btn btn-sm btn-danger" onClick={this.props.handleDestroy.bind(this, item.id)}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>  
            </div>
          </li>
        </div>
      );
    });
  }

  render() {
    return(
      <ul className="list-group workspaces-container">
        {this.renderItems()}
      </ul>
    );
  }
}
