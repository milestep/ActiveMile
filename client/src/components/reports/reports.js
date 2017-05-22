import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { actions as counterpartyActions } from '../../resources/counterparty';
import { toaster }                        from '../../actions/alerts';
import Filtr                              from './filtr';

@connect(
  state => ({
    counterparties: state.counterparties.items,
    currentWorkspace: state.workspaces.app.currentWorkspace
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...counterpartyActions,
      toaster
    }, dispatch)
  })
)
export default class Counterparties extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    counterparties: PropTypes.array.isRequired
  };
 
  componentDidMount(){
    const { actions } = this.props;

    actions.fetchCounterpartys();
  }

  componentWillReceiveProps(newProps) {
    const { actions } = this.props;
    const { currentWorkspace } = newProps;
    const prevWorkspace = this.props.currentWorkspace;
 
    if (currentWorkspace && currentWorkspace !== prevWorkspace) {
      actions.fetchCounterpartys();
    }
  }

  render() {
    if (this.props.counterparties && this.props.counterparties.length) {
      return(
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <Filtr
                counterparties = { this.props.counterparties }
              />
            </div>
          </div>
        </div>
      );
    } else {
      return(
        <div className="container">
          <div className="row">
            Підгружаються контерпаті...
          </div>
        </div>
      );
    }
  };
}
