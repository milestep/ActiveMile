import React, { Component, PropTypes } from 'react';
import Edit                            from './edit';

export default class List extends Component {
  static propTypes = {
    counterparties: PropTypes.array.isRequired,
    handleDestroy: PropTypes.func.isRequired,
    toggleEdited: PropTypes.func.isRequired,
    editedCounterparty: PropTypes.number
  };

  renderItems() {  
    const { counterparties, handleDestroy, toggleEdited, editedCounterparty } = this.props;

    return counterparties.map((item, i) => {
      const isEdited = editedCounterparty === item.id ? true : false;

      return (
        <div key={i}>
          <li className="list-group-item">
            { isEdited ?
              <Edit
                handleUpdate={this.props.handleUpdate}
                types={this.props.types}
                counterparty={item}
                toggleEdited={toggleEdited}
              />
            :
              <div className="counterparty-overlap">
                <div className="col-md-10">
                  <div className="counterparty-overlap">
                    <span className="col-md-6">{ item.name }</span>
                    <span className="col-md-3">{ item.type }</span>
                    <span className="col-md-3">{ item.date }</span>
                  </div>
                </div>
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={toggleEdited.bind(this, item.id, true)}
                  >
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={handleDestroy.bind(this, item.id)}>
                    <i className="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            }
          </li>
        </div>
      );
    });
  }

  render() {
    return(
      <ul className="list-group counterparty-container">
        {this.renderItems()}
      </ul>
    );
  }
}
