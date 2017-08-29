import React, { Component, PropTypes } from 'react';
import Form                            from './form';
import moment                          from 'moment';

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

  renderItems(type, active) {
    const { counterparties, handleDestroy, toggleEdited, editedCounterparty } = this.props;
    let counterpartiesNow = counterparties.filter(counterparty => counterparty.type === type && counterparty.active === active)

    if (counterpartiesNow && counterpartiesNow.length) {
      return counterpartiesNow.map((item, i) => {
        const isEdited = editedCounterparty === item.id ? true : false;

        return (
          <li key={i} className="list-group-item">
            { isEdited ?
              <div className="inline-form">
                <Form
                  handleSubmit={this.props.handleUpdate}
                  types={this.props.types}
                  counterparty={item}
                  editing={true}
                />
                <div className="form-btn-wrap">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={this.props.toggleEdited.bind(this, item.id, false)}
                  >
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            :
              <div className="tabs-overlap">
                <div className="col-md-10">
                  <span className={`col-md-9 ${ active ? '' : 'not-active' }`}>{ item.name }</span>
                  <span className={`col-md-3 ${ active ? '' : 'not-active' }`}>{ moment(item.date).format("DD-MM-YYYY") }</span>
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
        content = [],
        contentNotActive = [];

    this.props.types.forEach((type, i) => {
      const isCurrent = type === this.state.currentType ? true : false;
      const isFirst = i === 0 ? true : false;

      list.push(
        <li className={isCurrent ? 'active' : ''} key={i}>
          <a onClick={this.switchToType.bind(this, type)}>{type}</a>
        </li>
      );

      content.push(
        <div key={i}
          className={`tab-pane fade ${
            isCurrent ? ' active in' : ''
          }${
            isCurrent && isFirst ? ' first' : ''
          }`}
        >
          {this.renderItems(type, true)}
        </div>
      );

      contentNotActive.push(
        <div key={i+10}
          className={`tab-pane fade ${
            isCurrent ? ' active in' : ''
          }${
            isCurrent && isFirst ? ' first' : ''
          }`}
        >
          {this.renderItems(type, false)}
        </div>
      );
    });

    return { list, content, contentNotActive }
  }

  render() {
    const tabs = this.createTabsTemplate();

    return(
      <div class="site-tabs">
        <ul class="nav nav-tabs">
          {tabs.list}
        </ul>
        <div className="tab-content">
          {tabs.content}

          <br /><p>Not active</p>

          {tabs.contentNotActive}
        </div>
      </div>
    );
  }
}
