import React, { PropTypes }               from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { actions as counterpartyActions } from '../../resources/counterparties';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import { toaster }                        from '../../actions/alerts';
import InlineEditable                     from 'react-inline-editable-field';
import { CSVLink }                        from 'react-csv';

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
      costs: 0,
      counterUsers: {},
      data: []
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
    let counterlist = {}
    item.forEach((val, ind) => {
      if (val.active) {
        let type = val.type, curSalary = item[ind].salary;
        newState[type] = newState[type] + curSalary
      }
      counterlist = {...counterlist, [item[ind].id]: item[ind].salary}
    })
    this.setState({...newState, ...this.setSums(newState), counterUsers: counterlist})
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
    if (type == person.type && person.active && this.state.counterUsers[person.id] !== undefined) {
      return(
        <li className="list-group-item" key={i}>
          <div className="row">
            {console.log(person, type)}
            <span className={'col-md-6 person-name-' + type}>{ person.name }</span>
            <div onFocus={this.validationInput}>
              <InlineEditable className={'person-value-' + type} content={ this.state.counterUsers[person.id] } nputType="input" onBlur={(value) =>
              {this.countingNewData(value, person.id)}}/>
            </div>
          </div>
        </li>
      )
    }
  }

  validationInput(e){
    e.target.oninput = function (e) {
      e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    }
  }

  countingNewData(value, id = text) {
    if (value) {
      let totalRevenue = this.state.revenue
      let totalCosts = this.state.costs
      this.props.counterparties.forEach((item, key) => {
        if(item.type === "Client" && item.id === id) {
          totalRevenue = this.state.revenue - this.state.counterUsers[id] + +value
        } else if(item.id === id) {
          totalCosts = this.state.costs - this.state.counterUsers[id] + +value
        }
      })
      let newValue = this.state.counterUsers
      newValue[id] = +value
      this.setState({revenue: totalRevenue, costs: totalCosts, counterUsers: newValue})
    }
  }

  getDataCsv = () => {
    let newData = []

    let arrClientHeader = [
      ...document.getElementsByClassName('person-name-Client'),
      ...document.getElementsByClassName('total-client')
    ]
    this.dataPreparationCsv(arrClientHeader, newData)

    let arrClientValue = [
      ...document.querySelectorAll("span.person-value-Client"),
      ...document.getElementsByClassName('total-client-value')
    ]
    this.dataPreparationCsv(arrClientValue, newData)

    let vendorOtherHeader = [
      ...document.getElementsByClassName('person-name-Vendor'),
      ...document.getElementsByClassName('person-name-Other'),
      ...document.getElementsByClassName('total-other')
    ]
    this.dataPreparationCsv(vendorOtherHeader, newData)

    let vendorOtherValue = [
      ...document.querySelectorAll("span.person-value-Vendor"),
      ...document.querySelectorAll("span.person-value-Other"),
      ...document.getElementsByClassName('total-client-other')
    ]
    this.dataPreparationCsv(vendorOtherValue, newData)

    this.dataPreparationCsv(document.getElementsByClassName('forecast-total'), newData)
    this.dataPreparationCsv(document.getElementsByClassName('forecast-value'), newData)

  }

  dataPreparationCsv= (arr, newData) => {
    let list = []
    for (let i = 0; i < arr.length; i++) {
      list.push(arr[i].textContent)
    }
    newData.push(list)
    this.setState({data: newData})
  }

  render() {
    return(
      <div>
        <CSVLink onClick={this.getDataCsv} filename={"forecast.csv"} data={this.state.data} className="btn btn-primary csv">
          Download CSV
        </CSVLink>
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
                    <span className='col-md-6 text-right'><b className='total-client'>Total: </b></span>
                    <span className='col-md-6'><b className='total-client-value'>{this.state.revenue.toLocaleString()}</b></span>
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
                    <span className='col-md-6 text-right'><b className='total-other'>Total: </b></span>
                    <span className='col-md-6'><b className='total-client-other'>{this.state.costs.toLocaleString()}</b></span>
                  </div>
                </li>
            </ul>

            <ul className="list-group">
              <li className="list-group-item list-group-item-info">
                <div className="row">
                  <span className='col-md-6 text-right'><b className='forecast-total'>Forecast: </b></span>
                  <span className='col-md-6'><b className='forecast-value'>{(this.state.revenue - this.state.costs).toLocaleString()}</b></span>
                </div>
              </li>
            </ul>

          </div>
        </div>
      </div>
    );
  };
}
