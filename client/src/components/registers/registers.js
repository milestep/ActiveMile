import React, { Component, PropTypes }      from 'react';
import { bindActionCreators }               from 'redux';
import { connect }                          from 'react-redux';
import Select                               from 'react-select';
import moment                               from 'moment';
import { toaster }                          from '../../actions/alerts';
import { actions as registerActions }       from '../../resources/registers';
import { actions as subscriptionActions }   from '../../actions/subscriptions';
import { actions as workspaceActions }      from '../../actions/workspaces'
import RegisterForm                         from './form';
import RegistersList                        from './list';
import RegistersFilter                      from './filter';
import * as utils                           from '../../utils';

const monthsNames = moment.monthsShort();

@connect(
  state => ({
    registers: state.registers.items,
    articles: state.articles.items,
    counterparties: state.counterparties.items,
    isCreating: state.registers.isCreating,
    nextWorkspace: state.workspaces.app.next,
    isFetching: {
      registers: state.subscriptions.registers.fetching
    }
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...registerActions,
      ...subscriptionActions,
      ...workspaceActions,
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
    isCreating: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      registers: [],
      current: {
        year: null,
        month: null
      },
      filter: {
        years: []
      },
      isError: false,
      isSubscriptionsReceived: false
    };

    this.subscriptions = ['registers', 'articles', 'counterparties'];

    this.toaster = props.actions.toaster();
    this.handleCreate = this.handleCreate.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentWillMount() {
    this.props.actions.subscribe(this.subscriptions)
      .then(res => this.onSubscriptionsReceive())
      .catch(err => this.onSubscriptionsReject())
  }

  componentWillReceiveProps() {
    if (this.isNextWorkspaceChanged()) {
      this.onSubscriptionsReceive()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isSubscriptionsReceived || nextState.isError) return true
    if (this.isNextWorkspaceChanged()) return true
    return false
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions);
  }

  isNextWorkspaceChanged() {
    return this.props.actions.isNextWorkspaceChanged(this.props.nextWorkspace.id)
  }

  onSubscriptionsReceive() {
    this.setState({ isSubscriptionsReceived: true })
    this.createRegistersState()
  }

  onSubscriptionsReject(err) {
    this.setState(prevState => ({
      ...prevState,
      isError: true,
      isSubscriptionsReceived: false
    }))
  }

  createRegistersState(props = false) {
    if (!props) props = this.props;

    let filter = Object.assign({}, this.state.filter),
        current = Object.assign({}, this.state.current),
        currentMonth,
        registers = [];

    if (current.year === null)
      currentMonth = new Date().getMonth()
    else
      currentMonth = new Date(Date.parse(`${current.month} ${current.year}`)).getMonth()

    props.registers.forEach((register, i) => {
      const date = new Date(register.date);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (month == currentMonth)
        registers.push(register);

      if (!filter.years.includes(year))
        filter.years.push(year);
    });

    let bool = false
    let { years } = filter

    while(!bool) {
      bool = true

      for (var i = years.length - 1; i >= 0; i--) {
        if (years[i] <= years[i+1]) {
          bool = false
          let less_year = years[i]
          years[i] = years[i+1]
          years[i+1] = less_year
        }
      }
    }

    if (current.year === null) {
      Object.assign(current, {
        year: filter.years[0],
        month: monthsNames[currentMonth]
      });
    } else {
      Object.assign(current, {
        year: current.year,
        month: current.month
      });
    }

    this.setState((prevState) => ({
      ...prevState,
      registers,
      current,
      filter
    }));
  }

  handleCreate(register) {
    return new Promise((resolve, reject) => {
      delete register.article
      delete register.counterparty

      this.props.actions.createRegister({ register })
        .then(res => {
          this.setState(prevState => ({
            registers: [ ...prevState.registers, res.body ]
          }))
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
    if (confirm("Are you sure?")) {
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
  }

  handleFilterChange = field => e => {
    const { value } = e;

    this.setRegisters({
      ...this.state.current,
      [field]: value,
    });
    this.setState((prevState) => ({
      current: {
        ...prevState.current,
        [field]: value,
      }
    }));
  }

  setRegisters(current) {
    const registers = this.props.registers.filter((register, i) => {
      const date = new Date(register.date);

      return date.getFullYear() == current.year &&
             monthsNames[date.getMonth()] == current.month;
    });

    this.setState({ registers });
  }

  createRegisterList() {
    return !this.props.isFetching.registers ? (
      <RegistersList
        registers={this.state.registers}
        articles={this.props.articles}
        counterparties={this.props.counterparties}
        handleDestroy={this.handleDestroy}
      />
    ) : (
      <tbody>
        <tr>
          <td colSpan="6">
            <span className="spin-wrap">
              <i class="fa fa-spinner fa-spin fa-2x"></i>
            </span>
          </td>
        </tr>
      </tbody>
    )
  }

  render() {
    const { articles, counterparties } = this.props;

    return (
      <div>
        <h3 className="registers-title">
          Registers
        </h3>

        { articles.length ?
          <div className="row">
            <div className="col-md-9">
              <RegistersFilter
                filter={this.state.filter}
                current={this.state.current}
                handleFilterChange={this.handleFilterChange}
              />
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
                { this.createRegisterList() }
              </table>
            </div>

            <div className="col-md-3">
              <RegisterForm
                isFetching={this.props.isCreating}
                handleSubmit={this.handleCreate}
                articles={articles}
                counterparties={counterparties}
              />
            </div>

          </div>
        :
          <div className='alert alert-info'>
            <span>You must create articles before you can add records to the Register</span>
          </div>
        }
      </div>
    );
  }
}
