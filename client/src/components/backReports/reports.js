import React                              from 'react';
import cookie                             from 'react-cookie';
import { toaster }                        from '../../actions/alerts';
import { connect }                        from 'react-redux';
import { bindActionCreators }             from 'redux';

@connect(
  state => ({ }),
  dispatch => ({
    actions: bindActionCreators({toaster}, dispatch)
  })
)

export default class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: undefined,
      requestsMonths: [0,1,2,3,4,5,6,7,8,9,10,11],
      requestYear: (new Date()).getFullYear()
    }

    this.months = [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ]

    this.titleStyle = {
      width: '200px', 
      margin: '2px',
      display: 'inline-block'
    }

    this.toaster = props.actions.toaster();
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({...this.props.route.store.getState()});
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevState) != JSON.stringify(this.state)) {
      this.getData();
    }
  }

  getData() {
    let params = 'access_token='+this.props.route.store.getState().auth.token,
    workspaceId = cookie.load('current_workspace').id,
    myInit = { headers: { 'workspace-id': workspaceId,
                          'year': this.state.requestYear,
                          'months': this.state.requestsMonths.map(x=>++x) }},
    { hostname, protocol } = window.location;

    fetch(protocol+'//'+hostname+':3000/api/v1/reports?'+params, myInit)
    .then(response => response.json())
    .then(data => {this.setState({data, isLoaded: true})})
    .catch(e => {this.toaster.error('Could not connect to API'); console.error(e)})
  }

  getRow(person, i) {
    return(
      <tr key={i}>
        <th>{i}</th>
        <td>{person.name}</td>
      </tr>
    )
  }

  changeMonthsOfRequest(indexOfMonth) {
    if (this.state.requestsMonths.indexOf(indexOfMonth) + 1) {
      this.setState({requestsMonths: this.state.requestsMonths.filter(a => a !== indexOfMonth)})
    } else {
      this.setState({requestsMonths: this.state.requestsMonths.concat(indexOfMonth)})
    }
  }

  getBntStatus(i) {
    if (this.state.requestsMonths.indexOf(i) + 1) {
      return 'primary'
    } else {
      return 'secondary'
    }
  }

  compareNumeric(a, b) {
    if (a > b) return 1;
    if (a < b) return -1;
  }

  getMonthsButtons(name, i) {
    return(
      <button className={'btn btn-'+this.getBntStatus(i)} onClick={() => {this.changeMonthsOfRequest(i)}} key={i}>{name}</button>
    )
  }

  viewData() {
    return JSON.stringify(this.state.data)
  }


  handleChange(event) {
    this.setState({requestYear: event.target.value});
  }

  render() {
    {/*if (!this.state.isLoaded) {*/}
    if (!this.state.isLoaded) {
      return(
      <div>
        <h3 style={this.titleStyle}>Report by months: </h3>
        <input value={this.state.requestYear} onChange={this.handleChange}  name="year"
        style={this.titleStyle} type="number" step="1" min="2000" max="2100"/>
        <div className='btn-group'>
        {this.months.map((month, i) => this.getMonthsButtons(month, i))}
        </div>
        <h3>One second</h3>
        <button onClick={() => {this.getData()}}>Get data</button>
        <div>{JSON.stringify(this.state.data)}</div>  
      </div>    
      )
    } else {
      return(
        <div>
          <h3 style={this.titleStyle}>Report by months: </h3>
          <input value={this.state.requestYear} onChange={this.handleChange}  name="year"
                 style={this.titleStyle} type="number" step="1" min="2000" max="2100"/>
          <div className='btn-group'>
            {this.months.map((month, i) => this.getMonthsButtons(month, i))}
          </div>

          <table class="table">
            <thead>
              <tr>
                <th></th>
                {this.state.requestsMonths.sort(this.compareNumeric).map((item, i) => {
                  return(<th scope="col" key={item}>{this.months[item]}</th>)
                })}
              </tr>
            </thead>
              <tbody>
                <tr>
                  <td>Monthly revenue:</td>
                  {this.state.data.totals.Revenue.map((val, i) => {
                    return(
                      <td key={i}>{val}</td>
                    )
                  })}
                </tr>
              </tbody>
              {Object.keys(this.state.data["Revenue"]).map((type, i) => {
                return(
                  <tbody key={i}>
                    <tr>
                      <td>{type}</td>
                    </tr>                 
                    {Object.keys(this.state.data["Revenue"][type]).map((counterparty, i2) => {
                      return(
                        <tr key={i2}>
                          <td>{counterparty}</td>
                          {this.state.data["Revenue"][type][counterparty].map((val, i3) => {
                            return(
                              <td key={i3}>{val}</td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                )
              })}
          </table>

          <hr/>

          <table class="table">
            <thead>
              <tr>
                <th></th>
                {this.state.requestsMonths.sort(this.compareNumeric).map((item, i) => {
                  return(<th scope="col" key={item}>{this.months[item]}</th>)
                })}
              </tr>
            </thead>
              <tbody>
                <tr>
                  <td>Monthly cost:</td>
                  {this.state.data.totals.Cost.map((val, i) => {
                    return(
                      <td key={i}>{val}</td>
                    )
                  })}
                </tr>
              </tbody>
              {Object.keys(this.state.data["Cost"]).map((type, i) => {
                return(
                  <tbody key={i}>
                    <tr>
                      <td>{type}</td>
                    </tr>                 
                    {Object.keys(this.state.data["Cost"][type]).map((counterparty, i2) => {
                      return(
                        <tr key={i2}>
                          <td>{counterparty}</td>
                          {this.state.data["Cost"][type][counterparty].map((val, i3) => {
                            return(
                              <td key={i3}>{val}</td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                )
              })}
          </table>

          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total:</td>
                <td>{this.state.data.totals.Total.Revenue}</td>
                <td>{this.state.data.totals.Total.Cost}</td>
                <td>{this.state.data.totals.Total.Profit}</td>
              </tr>
              <tr>
                <td>AVG:</td>
                <td>{this.state.data.totals.AVG.Revenue}</td>
                <td>{this.state.data.totals.AVG.Cost}</td>
                <td>{this.state.data.totals.AVG.Profit}</td>
              </tr>
            </tbody>
          </table>

        </div>
      )
    }
  }
}