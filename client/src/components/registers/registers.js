import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import { getCurrentUser }                 from '../../helpers/currentUser';
import { toaster }                        from '../../actions/alerts';
import { actions as articleActions }      from '../../resources/article';
import { actions as counterpartyActions } from '../../resources/counterparty';
import { actions as registerActions }     from '../../resources/register';
// import RegistersList                      from './list';
// import RegisterForm                       from './form';
import * as utils                         from '../../utils';

@connect(
  state => ({
    registers: state.registers.items,
    isCreating: state.registers.isCreating,
    currentWorkspace: state.workspaces.app.current
  }), 
  dispatch => ({
    actions: bindActionCreators({
      ...articleActions,
      ...counterpartyActions,
      ...registerActions,
      toaster
    }, dispatch)
  })
)
export default class Registers extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    registers: PropTypes.array.isRequired,
    currentWorkspace: PropTypes.object,
    isCreating: PropTypes.bool
  };

  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    const { registers } = props;

    this.state = {
      registers: [ ...props.registers ],
      // articles: [ ...props.articles ],
      // counterparties: [ ...props.counterparties ],
      currentWorkspace: props.currentWorkspace,
      editedRegister: null,
      isFetching: {
        registers: false,
        articles: false,
        counterparties: false
      }
    };

    this.toaster = props.actions.toaster();
    // this.handleCreate = this.handleCreate.bind(this);
    // this.handleUpdate = this.handleUpdate.bind(this);
    // this.handleDestroy = this.handleDestroy.bind(this);
    // this.toggleEdited = this.toggleEdited.bind(this);
  }

  componentWillMount() {
    this.fetchDependencies(this.props);
  }

  componentWillReceiveProps(newProps) {
    const { currentWorkspace, registers } = newProps;
    const prevWorkspace = this.props.currentWorkspace;
    const prevRegisters = this.state.registers;

    this.fetchRegisters(newProps);

    if (registers !== prevRegisters) {
      this.setState({
        registers: [ ...registers ]
      });
    }
  }

  fetchDependencies(props) {
    const prevWorkspace = this.state.currentWorkspace;
    const { currentWorkspace } = props;
    
    // console.log("CURRENT -> ", currentWorkspace);
    // console.log("PREV -> ", prevWorkspace);

    if (currentWorkspace !== prevWorkspace) {
      this.fetchRegisters(props)
        .then(res => {
          this.fetchArticles();
          this.fetchCounterparties();
        })
    }
  }

  fetchRegisters(props) {
    return new Promise((resolve, reject) => {
      const { actions, currentWorkspace } = props;
      const { isFetching } = this.state;

      if (isFetching.registers) return;

      this.toggleFetching('registers', true);

      actions.fetchRegisters()
        .then(res => {
          this.toggleFetching('registers', false);
          this.setState({ currentWorkspace });
          resolve(res);
        })
        .catch(err => {
          this.toggleFetching('registers', false);
          if (utils.debug) console.error(err);
          this.toaster.error('Could not load registers!');
          reject(err);
        });
    });
  }

  fetchArticles() {
    actions.fetchArticles()
      .then(res => {
        this.toggleFetching('articles', false);
      })
      .catch(err => {
        this.toggleFetching('articles', false);
        if (utils.debug) console.error(err);
        this.toaster.error('Could not load articles!');
      });
  }

  fetchCounterparties() {
    actions.fetchCounterpartys()
      .then(res => {
        this.toggleFetching('counterparties', false);
      })
      .catch(err => {
        this.toggleFetching('counterparties', false);
        if (utils.debug) console.error(err);
        this.toaster.error('Could not load counterparties!');
      });
  }

  toggleFetching(field, status) {
    this.setState((prevState) => ({
      isFetching: {
        ...prevState.isFetching,
        [field]: status
      }
    }));
  }

  render() {
    return null;
  }
}
