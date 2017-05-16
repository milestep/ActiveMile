import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { actions as counterpartyActions } from '../../resources/counterparty';
import { toaster }                        from '../../actions/alerts';
import List                               from './list';
import Form                               from './form';

@connect(
  state => ({
    counterparties: state.counterparties.items,
    isFetching: state.counterparties.isFetching,
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

  constructor(props) {
    super(props);

    this.types = ['Client', 'Vendor', 'Other'];

    this.state = {
      editedCounterparty: null
    };

    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.toggleEdited = this.toggleEdited.bind(this);
    this.toaster = props.actions.toaster();
  }

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

  handleDestroy(id) {
    const { actions } = this.props;

    actions.deleteCounterparty(id)
    .then(res => {
      this.toaster.success('Counterparty was successfully deleted!');
    })
    .catch(err => {
      this.toaster.error('Could not delete counterparty!');
    })
  }

  toggleEdited(id, status) {
    let { editedCounterparty } = this.state;

    if (status) {
      editedCounterparty = id;
    } else {
      editedCounterparty = null;
    }

    this.setState({
      editedCounterparty: editedCounterparty
    });
  }

  handleUpdate(counterparty, id) {
    const { actions } = this.props;

    actions.updateCounterparty({ id, counterparty })
    .then(res => {
      this.toggleEdited(id, false)
      this.toaster.success('Counterparty has been updated'); 

      actions.fetchCounterpartys()
    })
    .catch(err => {
      this.toaster.error('Could not update counterparty!');
    });
  }

  handleSubmit(counterparty) { 
    return new Promise((resolve, reject) => {
      const { actions } = this.props;

      actions.createCounterparty({ counterparty })
        .then(res => {
          this.toaster.success('Counterparty has been created');
          actions.fetchCounterpartys();
          resolve(res);
        })
        .catch(err => {
          this.toaster.error('Could not create counterparty!');
          reject(err);
        });
    })
  }

  render() {
    return(
      <div className="container">
        <h3>Counterparties</h3>

        <div className="row">
          <div className="col-md-8">
            <List
              counterparties={this.props.counterparties}
              handleDestroy={this.handleDestroy}
              toggleEdited={this.toggleEdited}
              editedCounterparty={this.state.editedCounterparty}
              types={this.types}
              handleUpdate={this.handleUpdate}
              isFetching={this.props.isFetching}
            />
          </div>

          <div className="col-md-4">
            <Form
              handleSubmit={this.handleSubmit}
              types={this.types}
            />
          </div>
        </div>
      </div>
    );
  };
}
