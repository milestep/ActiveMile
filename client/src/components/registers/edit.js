import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { push }                           from 'react-router-redux';
import { defaultHeaders }                 from 'redux-rest-resource';
import { toaster }                        from '../../actions/alerts';
import * as utils                         from '../../utils';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import { show as getRegister }            from '../../actions/registers'
import { update as updateRegister }       from '../../actions/registers'
import RegisterForm                       from './form';

@connect(
  state => ({
    register: state.registers.item,
    articles: state.articles.items,
    counterparties: state.counterparties.items,
    isUpdating: state.registers.isUpdating,
    isFetching: {
      articles: state.articles.isFetching,
      counterparties: state.counterparties.isFetching
    }
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...subscriptionActions,
      toaster,
      getRegister,
      updateRegister
    }, dispatch),

    isUpdatingFunk: (bool) => {
      dispatch({ type: 'REGISTER/IS_UPDATING', payload: bool })
    }
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

    this.subscriptions = ['articles', 'counterparties'];

    this.toaster = props.actions.toaster();
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentWillMount() {
    const { actions, params } = this.props;

    actions.subscribe(this.subscriptions);

    actions.getRegister(params.id)
      .then(res => {
        this.setState({ registerFetched: true });
      })
      .catch(err => {
        if (utils.debug) console.error(err);
        this.toaster.error('Could not laod register!');
      })
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions);
  }

  handleUpdate(inputRegister) {
    this.props.isUpdatingFunk(true)

    return new Promise((resolve, reject) => {
      const { actions, dispatch, params } = this.props;
      const id = +params.id;

      actions.updateRegister({ id, register: inputRegister })
        .then(res => {
          dispatch(push('/registers'));
          this.toaster.success('Register has been updated');
          this.props.isUpdatingFunk(false)
          resolve(res);
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          this.toaster.error('Could not update article!');
          this.props.isUpdatingFunk(false)
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
