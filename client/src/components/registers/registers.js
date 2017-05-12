import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { getCurrentUser }                 from '../../helpers/currentUser';
import { toaster }                        from '../../actions/alerts';
import { actions as articleActions }      from '../../resources/article';
import { actions as counterpartyActions } from '../../resources/counterparty';
import { actions as registerActions }     from '../../resources/register';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import RegisterForm                       from './form';
import * as utils                         from '../../utils';

@connect(
  state => ({
    registers: state.registers.items,
    articles: state.articles.items,
    counterparties: state.counterparties.items,
    isCreating: state.registers.isCreating,
    isFetching: {
      registers: state.registers.isFetching,
      articles: state.articles.isFetching,
      counterparties: state.counterparties.isFetching
    }
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...articleActions,
      ...counterpartyActions,
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
    isCreating: PropTypes.bool
  };

  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      editedRegister: null
    };

    this.subscriptions = ['registers', 'articles', 'counterparties'];

    this.toaster = props.actions.toaster();
  }

  componentWillMount() {
    this.props.actions.subscribe(this.subscriptions);
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions);
  }

  render() {
    return null;
  }
}
