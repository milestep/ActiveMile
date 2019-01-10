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
      requestsMonths: [],
      requestYear: []
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
                          'months': this.state.requestsMonths }},
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

  getMonthsButtons(name, i) {
    return(
      <button className={'btn btn-'+this.getBntStatus(i)} onClick={() => {this.changeMonthsOfRequest(i)}} key={i}>{name}</button>
    )
  }

  render() {
    {if (this.state.data) { console.log(this.state.data.slice(-1)[0].months)} }
    if (!this.state.isLoaded) {
      return(
      <div>
        <h3>One second</h3>
        <button onClick={() => {this.getData()}}>Get data</button>
      </div>        
      )
    } else {
      return(
        <div>
          <h3 style={this.titleStyle}>Report by months: </h3>

          <select className="form-control" style={this.titleStyle}>
            <option>2007</option>
            <option>2007</option>
            <option>2007</option>
          </select>

          <div className='btn-group'>
            {this.months.map((month, i) => this.getMonthsButtons(month, i))}
          </div>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">ищщщщу</th>
                <th scope="col">Month</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((person, i) => this.getRow(person, i))}
            </tbody>
          </table>
        </div>
      )
    }
  }
}