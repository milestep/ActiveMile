import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import Select                             from 'react-select';
import moment                             from 'moment';
import { toaster }                        from '../../actions/alerts';
import { actions as registerActions }     from '../../resources/register';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import RegisterForm                       from './form';
import RegistersList                      from './list';
import RegistersFilter                    from './filter';
import * as utils                         from '../../utils';

const monthsNames = moment.monthsShort();

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
      registers: [],
      current: {
        year: null,
        month: null
      },
      filter: {
        years: []
      }
    };

    this.subscriptions = ['registers', 'articles', 'counterparties'];

    this.toaster = props.actions.toaster();
    this.handleCreate = this.handleCreate.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentWillMount() {
    this.props.actions.subscribe(this.subscriptions);
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions);
  }

  componentWillReceiveProps(newProps) {
    const isDataReady = this.isModelsFetched(this.subscriptions, newProps);

    if (isDataReady) {
      this.createRegistersState(newProps);
    }
  }

  createRegistersState(props = false) {
    if (!props) props = this.props;

    let filter = Object.assign({}, this.state.filter),
        current = Object.assign({}, this.state.current),
        currentMonth = new Date().getMonth(),
        registers = [];

    props.registers.forEach((register, i) => {
      const date = new Date(register.date);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (month == currentMonth)
        registers.push(register);

      if (!filter.years.includes(year))
        filter.years.push(year);
    });

    Object.assign(current, {
      year: filter.years[0],
      month: monthsNames[currentMonth]
    });

    this.setState((prevState) => ({
      ...prevState,
      registers,
      current,
      filter
    }));
  }

  handleCreate(register) {
    return new Promise((resolve, reject) => {
      delete register.article;
      delete register.counterparty;

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

  isModelsFetched(models, inputProps = false) {
    const props = inputProps || this.props;
    const { isResolved } = props;
    const { empty } = utils;
    let returnedValue = true;

    models.forEach((model, i) => {
      if (!isResolved[model]) {
        returnedValue = false;
        return;
      }
    });

    return returnedValue;
  }

  createRegisterList() {
    const { registers } = this.state;
    const { articles, counterparties, isResolved } = this.props;
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
      );
    } else if (!isResolved.registers) {
      registerList = (
        <tbody>
          <tr>
            <td colSpan="6">
              <span className="spin-wrap">
                <i class="fa fa-spinner fa-spin fa-2x"></i>
              </span>
            </td>
          </tr>
        </tbody>
      );
    } else if (isResolved.registers) {
      registerList = (
        <tbody>
          <tr>
            <td rowSpan="6">
              There are no registers...
            </td>
          </tr>
        </tbody>
      );
    }

    return registerList;
  }

  render() {
    const { articles, counterparties, isCreating } = this.props;
    const isFormDataReady = this.isModelsFetched(['articles', 'counterparties']);
    const registerList = this.createRegisterList();

    return (
      <div>
        <h3 className="registers-title">
          Registers
        </h3>

        <div className="row">
          <div className="col-md-8">
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
