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
      requestYear: (new Date()).getFullYear(),
      minimize: true
    }

    this.months = [
      'Jan', 'Feb', 'Mar', 'Apr',
      'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec'
    ]

    this.types = ["Revenue", "Cost"]

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
      <button className={'btn btn-'+this.getBntStatus(i)} 
      onClick={() => {this.changeMonthsOfRequest(i)}} key={i}>{name}</button>
    )
  }

  viewData() {
    return JSON.stringify(this.state.data)
  }

  toggleMinimize() {
    this.setState({minimize: !this.state.minimize})
  }

  getTypesSum(type, clas) {
    let x = Array(this.state.requestsMonths.length).fill(0)
    for (var counterparty in this.state.data[clas][type]) {
      x.forEach((item, ind)=>{
        x[ind] += this.state.data[clas][type][counterparty][ind]
      })
    }

    return x.map((val, key) => {
      return <td key={key}>{val}</td>
    })
  }

  handleChange(event) {
    this.setState({requestYear: event.target.value});
  }

  render() {
    console.log(this.state.data)
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
            {this.months ?
             this.months.map((month, i) => this.getMonthsButtons(month, i)) :
             null}
          </div>
          <button className="btn" onClick={()=>{this.toggleMinimize()}}>
            {this.state.minimize ? "Advanced report" : "Short report"}
          </button>

          {this.types.map((clas, index)=>{
            return(
              <table className="table table-bordered" key={index}>
                <thead className="thead-dark">
                  <tr>
                    <th></th>
                    {this.state.requestsMonths ?
                      this.state.requestsMonths.sort(this.compareNumeric).map((item, i) => {
                      return(<th scope="col" className="text-info bg-dark" key={item}>{this.months[item]}</th>)
                    }) : null}
                  </tr>
                </thead>
                  <tbody>
                    <tr className="bg-success">
                      <td>Monthly {clas.toLowerCase()}:</td>
                      {this.state.data.totals[clas] ?
                        this.state.data.totals[clas].map((val, i) => {
                        return(
                          <td key={i}>{val}</td>
                        )
                      }) : null}
                    </tr>
                  </tbody>
                  {this.state.data[clas] ?
                    Object.keys(this.state.data[clas]).map((type, i) => {
                    return(
                      <tbody key={i}>
                        <tr onClick={()=>{console.log(':)')}} className="bg-primary">
                          <td>{type}</td>
                          {this.getTypesSum(type, clas)}
                        </tr>
                        {Object.keys(this.state.data[clas][type]).map((counterparty, i2) => {
                          return(
                            <tr key={i2} className={this.state.minimize ? "hide" : ""}>
                              <td>{counterparty}</td>
                              {this.state.data[clas][type][counterparty].map((val, i3) => {
                                return(
                                  <td key={i3}>{val}</td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    )
                  }) : null}
              </table>
            )
          })}

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