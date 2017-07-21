import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { push }                           from 'react-router-redux';
import { defaultHeaders }                 from 'redux-rest-resource';
import { toaster }                        from '../../actions/alerts';
import * as utils                         from '../../utils';
import { actions as registerActions }     from '../../resources/registers';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import RegisterForm                       from './form';

@connect(
  state => ({
    register: state.registers.item,
    registers: state.registers.items,
    articles: state.articles.items,
    counterparties: state.counterparties.items,
    isUpdating: state.registers.isUpdating,
    isFetching: {
      register: state.registers.isFetchingItem,
      articles: state.articles.isFetching,
      counterparties: state.counterparties.isFetching
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
export default class RegistersEditor extends Component {
  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      registerFetched: null
    }

    this.subscriptions = ['registers', 'articles', 'counterparties'];

    this.toaster = props.actions.toaster();
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentWillMount() {
    const { actions, params } = this.props;
    const { id } = params;

    actions.subscribe(this.subscriptions);

    actions.getRegister(id)
      .then(res => {
        this.setState({ registerFetched: true });
      })
      .catch(err => {
        if (utils.debug) console.error(err);
        this.toaster.error('Could not laod register!');
        reject(err);
      })
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions);
  }

  handleUpdate(inputRegister) {
    return new Promise((resolve, reject) => {
      const { actions, dispatch, params } = this.props;
      const id = +params.id;

      actions.updateRegister({ id, register: inputRegister })
        .then(res => {
          dispatch(push('/registers'));
          this.toaster.success('Register has been updated');
          resolve(res);
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          this.toaster.error('Could not update article!');
          reject(err);
        });
    })
  }

  isDataReady() {
    const { empty } = utils;
    let returnedValue = true;

    if (!this.state['registerFetched']) {
      return false;
    }

    this.subscriptions.forEach((model, i) => {
      if (empty(this.props[model])) {
        returnedValue = false;
        return;
      }
    });

    return returnedValue;
  }

  render() {
    const { register, articles, counterparties, isUpdating } = this.props;
    const { empty } = utils;
    const isDataReady = this.isDataReady();

    return(
      <div className="row">
        <div className="col-md-6 col-md-offset-3">
          { isDataReady ?
            <RegisterForm
              editing={true}
              isFetching={isUpdating}
              handleSubmit={this.handleUpdate}
              register={register}
              articles={articles}
              counterparties={counterparties}
            />
          : null }
        </div>
      </div>
    )
  }
}
