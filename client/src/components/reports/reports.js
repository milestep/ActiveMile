import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import moment                             from 'moment';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import { actions as counterpartyActions } from '../../resources/counterparty';
import { toaster }                        from '../../actions/alerts';
import * as utils                         from '../../utils';
import Select                             from 'react-select';

@connect(
  state => ({
    registers: state.registers.items,
    articles: state.articles.items,
    counterparties: state.counterparties.items,
    isResolved: {
      registers: state.subscriptions.registers.resolved,
      articles: state.subscriptions.articles.resolved,
      counterparties: state.subscriptions.counterparties.resolved
    }
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...subscriptionActions,
      toaster
    }, dispatch)
  })
)
export default class Reports extends Component {
  static propTypes = {
    registers: PropTypes.array.isRequired,
    articles: PropTypes.array.isRequired,
    counterparties: PropTypes.array.isRequired,
    isResolved: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.types = ['Revenue', 'Cost'];
    this.subscriptions = ['registers', 'articles', 'counterparties'];
    this.toaster = props.actions.toaster();

    this.state = {
      articles: null,
      isDataReady: false,
      current: {
        year: null,
        month: null,
        type: null,
        article: null
      }
    };
  }

  componentWillMount() {
    this.props.actions.subscribe(this.subscriptions);
  }

  componentWillUnmount() {
    this.props.actions.unsubscribe(this.subscriptions);
  }

  componentWillReceiveProps(newProps) {
    const isDataReady = this.isModelsFetched(this.subscriptions, newProps);

    if (isDataReady !== this.state.isDataReady) {
      this.setState({
        isDataReady: this.isModelsFetched(this.subscriptions, newProps)
      });
    }

    if (isDataReady) {
      this.createArticlesState(newProps);
    }
  }

  createArticlesState(props = false) {
    if (!props) props = this.props;

    const { articles, registers, counterparties } = props;

    let { state, current, profit, monthsNames } = {
      state: {},
      current: {},
      profit: 0,
      monthsNames: moment.monthsShort()
    };

    registers.forEach((register, i) => {
      const { article_id, counterparty_id } = register;
      const article = articles.find((art, i) => art.id === article_id);
      const counterparty = counterparties.find((cont, i) => cont.id === counterparty_id);
      const { type } = article;

      let date = new Date(register.date);
      let monthIndex = date.getMonth();
      let year = date.getFullYear();
      let month = monthsNames[monthIndex]

      // Year
      if (!state[year]) state[year] = [];

      // Month
      if (!state[year][month]) state[year][month] = [];

      // Article type
      state[year][month]['Revenue'] = state[year][month]['Cost'] = null;
      if (!state[year][month][type]) state[year][month][type] = [];

      let currentType = state[year][month][type];

      // Set value && increment profit
      let value = type == 'Revenue' ? register.value : -register.value;
      profit += value;

      // Insert articles into article types
      if (currentType.length) {
        currentType.forEach((art, i) => {
          if (art.id === article_id) {
            let exists = false;

            art.counterparties.forEach((c, j) => {
              if (c.id === counterparty_id) {
                c.value += value;
                exists = true;
                return;
              }
            });

            if (!exists) {
              counterparty['value'] = value;
              art.counterparties.push(counterparty);
            }
          }
        })
      } else {
        state[year][month][type].push(Object.assign({}, article, {
          counterparties: [Object.assign({}, counterparty, { value })]
        }));
      }
    });

    // Create default current
    Object.assign(current, this.state.current);
    current.year = Object.keys(state)[Object.keys(state).length - 1];
    current.month = function() {
      let months = state[current.year];
      for (let i in months) {
        if (months[i]) return i;
      }
    }();
    current.type = Object.keys(state[current.year][current.month])[0];

    this.setState((prevState) => ({
      ...prevState,
      articles: state,
      profit: profit,
      current: {
        ...prevState.current,
        ...current
      }
    }));
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

  handleYearChange(e) {
    this.setState((prevState) => ({
      current: {
        ...prevState.current,
        year: e.value
      }
    }));
  }

  handleMonthChange = month => e => {
    e.preventDefault();
    this.setState((prevState) => ({
      current: {
        ...prevState.current, month
      }
    }));
  }

  render() {
    const { isDataReady } = this.state;

    const { articles, current } = this.state;
    const monthsNames = moment.monthsShort();

    // Create years options
    let yearsOptions = [];
    for (let i in articles) {
      yearsOptions.push({ value: i, label: i });
    }

    // Create months list (Tabs)
    monthsNames.forEach((monthName, i) => {
      if (!articles[current.year][monthName]) {
        articles[current.year][monthName] = null;
      }
    })
    let monthsList = [];
    for (let month in articles[current.year]) {
      monthsList.push(
        <li className={current.month == month ? "active": ""} key={month}>
          <a
            href="#"
            onClick={(e) => this.handleMonthChange(month)(e)}
          >{month}</a>
        </li>
      );
    }

    return(
      <div>
        <div className="registers-filter">
          <Select
            name="years"
            className="registers-filter-select"
            onChange={this.handleYearChange.bind(this)}
            options={yearsOptions}
            value={current.year}
          />
          <ul class="nav nav-pills">
            {monthsList}
          </ul>
        </div>
      </div>
    );
  }
}
