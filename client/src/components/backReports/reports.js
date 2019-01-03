import React                              from 'react';
import { toaster }                        from '../../actions/alerts';
import { connect }                        from 'react-redux';
import { bindActionCreators }             from 'redux';

@connect(
  state => ({
    currentWorkspace: state.workspaces.app.current
  }),
  dispatch => ({
    actions: bindActionCreators({toaster}, dispatch)
  })
)

export default class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      data: null
    }

    this.toaster = props.actions.toaster();
  }

  componentDidMount() {
    this.setState({...this.props.route.store.getState()})
  }

  // componentWillMount() {
  //   console.log('as')
  //   console.log(this.props.currentWorkspace)
  // }

  getData() {   
    let params = 'access_token='+this.props.route.store.getState().auth.token,
    myInit = { headers: { 'workspace-id': this.props.currentWorkspace.id }},
    { hostname, protocol } = window.location;

    fetch(protocol+'//'+hostname+':3000/api/v1/reports?'+params, myInit)
    .then(response => response.json())
    .then(data => {this.setState({data, isLoaded: true})})
    .catch(e => {this.toaster.error('Could not connect to API')})
  }

  render() {
    // {console.log(this)}
    {console.log(this.state.data)}
    {console.log(this.props.currentWorkspace)}
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
          <h3>Report by monts</h3>
          <button onClick={() => {this.getData()}}>Get data</button>





        </div>
      )
    }
  }
}