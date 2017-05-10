import React, { Component, PropTypes } from 'react';
import Edit                            from './edit';

export default class List extends Component {
  static propTypes = {
    counterparties: PropTypes.array.isRequired,
    handleDestroy: PropTypes.func.isRequired,
    toggleEdited: PropTypes.func.isRequired,
    editedCounterparty: PropTypes.number,
    isFetching: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    
    this.state = {
      currentType: this.props.types[0]
    };
  }; 

  renderItems(type) {  
    const { counterparties, handleDestroy, toggleEdited, editedCounterparty } = this.props;

    let counterparties_now = counterparties.filter(t => t.type === type)

    if (counterparties_now && counterparties_now.length) {
      return counterparties_now.map((item, i) => {
        const isEdited = editedCounterparty === item.id ? true : false;

        return (
          <li key={i} className="list-group-item">
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
        );
      });
    } else {
      return (
        <li className="list-group-item">
          <div className="alert alert-info">
            { this.props.isFetching ?
              <span className="spin-wrap">
                <i class="fa fa-spinner fa-spin fa-2x"></i>
              </span>
            :
              <span>There is no counterparties here</span>
            }
          </div>
        </li>
      );
    }
  }

  switchToType(type) {
    this.setState((prevState) => ({
      ...prevState,
      currentType: type
    }));
  }

  createTabsTemplate() {
    let list    = [],
        content = [];

    this.props.types.forEach((type, i) => {
      const isCurrent = type === this.state.currentType ? true : false;

      list.push(
        <li className={isCurrent ? 'active' : ''} key={i}>
          <a onClick={this.switchToType.bind(this, type)}>{type}</a>
        </li>
      );

      content.push(
        <div key={i}
          className={`tab-pane fade${
            isCurrent ? ' active in' : ''
          }`}
        >
          {this.renderItems(type)}
        </div>
      );
    });
    
    return { list, content }
  }

  render() {
    const tabs = this.createTabsTemplate();

    return(
      <div class="articles-tabs">
        <ul class="nav nav-tabs">
          {tabs.list}
        </ul>
        <div className="tab-content">
          {tabs.content}
        </div>
      </div> 
    );
  }
}
