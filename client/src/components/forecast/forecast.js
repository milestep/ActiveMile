import React, { PropTypes }               from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { actions as counterpartyActions } from '../../resources/counterparties';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import { toaster }                        from '../../actions/alerts';

@connect(
  state => ({
    currentFeatures: state.features,
    counterparties: state.counterparties.rest.items,
    isFetching: state.counterparties.rest.isFetching
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...counterpartyActions,
      ...subscriptionActions,
      toaster
    }, dispatch)
  })
)

export default class Forecast extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    counterparties: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.types = ['Client', 'Vendor', 'Other'];

    const { currentFeatures } = this.props;
    if (currentFeatures && currentFeatures.sales) this.types.push('Sales');

    this.subscriptions = ['counterparties'];

    this.state = {
      editedCounterparty: null,      
      revenue: 0,
      costs: 0
    };
    this.toaster = props.actions.toaster();
  }

  componentWillMount() {
    this.props.actions.subscribe(this.subscriptions);
    this.countSalarys(this.props.counterparties);
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions);
  }

  componentWillReceiveProps(newProps) {
    const { currentFeatures } = newProps;

    this.types = ['Client', 'Vendor', 'Other'];
    if (currentFeatures && currentFeatures.sales) this.types.push('Sales');

    this.countSalarys(this.props.counterparties);
  }

  countSalarys(item) {
    let newState = { Client: 0, Vendor: 0, Other: 0, Sales: 0 }
    item.forEach((val, ind) => {
      if (val.active) {
      let type = val.type, curSalary = item[ind].salary;
      newState[type] = newState[type] + curSalary}
    })
    this.setState({...newState, ...this.setSums(newState)})
  }

  setSums(newState) {
    return({
      revenue: newState.Client,
      costs:   newState.Vendor
             + newState.Other
             + (newState.Sales || 0)
    })    
  }

  getCurentPersons(person, type, i) {
    if (type == person.type && person.active) {
      return(
        <li className="list-group-item" key={i}>
          <div className="row">
            <span className='col-md-6'>{ person.name }</span>
            <span className='col-md-6'>{ person.salary.toLocaleString() }</span>
          </div>
        </li>
      )
    }
  }

  render() {
    return(
      <div>
        <h3>Forecast</h3>
        <div className="row">
          <div className="col-md-6">

            <div>{this.types[0]}</div>
            <ul className="list-group">
              {this.props.counterparties.map((person, i) =>
                this.getCurentPersons(person, this.types[0], i)
              )}
                <li className="list-group-item list-group-item-success">
                  <div className="row">
                    <span className='col-md-6 text-right'><b>Total: </b></span>
                    <span className='col-md-6'><b>{this.state.revenue.toLocaleString()}</b></span>
                  </div>
                </li>
            </ul>

            <div>{this.types[1]} + {this.types[2]} {this.types[3] ? '+ '+this.types[3] : ''}</div>
            <ul className="list-group">
              {this.props.counterparties.map((person, i) => this.getCurentPersons(person, this.types[1], i))}
              {this.props.counterparties.map((person, i) => this.getCurentPersons(person, this.types[2], i))}
              {this.state[this.types[3]] ?
                this.props.counterparties.map((person, i) =>
                this.getCurentPersons(person, this.types[3], i))
                : null
              }
                <li className="list-group-item list-group-item-danger">
                  <div className="row">
                    <span className='col-md-6 text-right'><b>Total: </b></span>
                    <span className='col-md-6'><b>{this.state.costs.toLocaleString()}</b></span>
                  </div>
                </li>
            </ul>

            <ul className="list-group">
              <li className="list-group-item list-group-item-info">
                <div className="row">
                  <span className='col-md-6 text-right'><b>Forecast: </b></span>
                  <span className='col-md-6'><b>{(this.state.revenue - this.state.costs).toLocaleString()}</b></span>
                </div>
              </li>
            </ul>

          </div>
        </div>
      </div>
    );
  };
}
