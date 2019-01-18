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

  handleChange(date) {
    console.log(date);
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

  viewData() {
    return JSON.stringify(this.state.data)
  }


  handleChange(event) {
    this.setState({requestYear: event.target.value});
  }

  render() {
    console.log(this.state.data)
    {/*if (!this.state.isLoaded) {*/}
    if (1) {
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
                <th scope="col">Names: </th>
                {Object.keys(this.state.data).map((item, i) => {
                  return(<th scope="col" key={item}>{this.months[item-1]}</th>)
                })}
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.data).map((item, i) => {
                return(this.state.data[item].users == false ?
                null :
                this.state.data[item].users.map((val, key) => {
                  return(
                    <tr key={key}>
                      <th>{val.name}</th>
                    </tr>
                )}))})}
            </tbody>
          </table>
        </div>
      )
    }
  }
}