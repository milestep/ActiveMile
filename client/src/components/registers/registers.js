import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { getCurrentUser }                 from '../../helpers/currentUser';
import { toaster }                        from '../../actions/alerts';
import { actions as registerActions }     from '../../resources/register';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import RegisterForm                       from './form';
import RegistersList                      from './list';
import * as utils                         from '../../utils';

@connect(
  state => ({
    registers: state.registers.items,
    articles: state.articles.items,
    counterparties: state.counterparties.items,
    isCreating: state.registers.isCreating,
    isResolved: {
      registers: state.subscriptions.registers.resolved,
      articles: state.subscriptions.articles.resolved,
      counterparties: state.subscriptions.counterparties.resolved
    }
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...registerActions,
      ...subscriptionActions,
      toaster
    }, dispatch)
  })
)
export default class Registers extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    registers: PropTypes.array.isRequired,
    articles: PropTypes.array.isRequired,
    counterparties: PropTypes.array.isRequired,
    isResolved: PropTypes.object.isRequired,
    isCreating: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      editedRegister: null
    };

    this.subscriptions = ['registers', 'articles', 'counterparties'];

    this.toaster = props.actions.toaster();
    this.handleCreate = this.handleCreate.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
  }

  componentWillMount() {
    this.props.actions.subscribe(this.subscriptions);
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions);
  }

  handleCreate(register) {
    return new Promise((resolve, reject) => {
      delete register.article
      delete register.counterparty

      this.props.actions.createRegister({ register })
        .then(res => {
          this.toaster.success('Register has been created');
          resolve(res);
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          this.toaster.error('Could not create register!');
          reject(err);
        });
    })
  }

  handleDestroy(id) {
    const { actions } = this.props;

    actions.deleteRegister(id)
      .then(res => {
        this.toaster.success('Register was successfully deleted!');
      })
      .catch(err => {
        if (utils.debug) console.error(err);
        this.toaster.error('Could not delete register!');
      })
  }

  isModelsFetched(models) {
    const { isResolved } = this.props;
    const { empty } = utils;
    let returnedValue = true;

    models.forEach((model, i) => {
      if (empty(this.props[model]) || !isResolved[model]) {
        returnedValue = false;
        return;
      }
    });

    return returnedValue;
  }

  createRegisterList() {
    const { registers, articles, counterparties, isResolved } = this.props;
    const isFormDataReady = this.isModelsFetched(['articles', 'counterparties']);
    const isListDataReady = this.isModelsFetched(['registers']) && isFormDataReady;

    let registerList;

    if (isListDataReady && isResolved.registers) {
      registerList = (
        <RegistersList
          registers={registers}
          articles={articles}
          counterparties={counterparties}
          handleDestroy={this.handleDestroy}
        />
      )
    } else if (!isResolved.registers) {
      registerList = (<tbody><tr><td rowSpan="6">Fetching...</td></tr></tbody>)
    } else if (isResolved.registers) {
      registerList = (<tbody><tr><td rowSpan="6">There are no registers...</td></tr></tbody>)
    }

    return registerList;
  }

  render() {
    const { articles, counterparties, isCreating } = this.props;
    const isFormDataReady = this.isModelsFetched(['articles', 'counterparties']);
    const registerList = this.createRegisterList();

    return (
      <div>
        <h3>Registers</h3>

        <div className="row">
          <div className="col-md-8">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Article</th>
                  <th>Counterparty</th>
                  <th>Value</th>
                  <th>Notes</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              { registerList }
            </table>
          </div>

          { isFormDataReady ?
            <div className="col-md-4">
              <RegisterForm
                isFetching={isCreating}
                handleSubmit={this.handleCreate}
                articles={articles}
                counterparties={counterparties}
              />
            </div>
          : null }
        </div>
      </div>
    );
  }
}
