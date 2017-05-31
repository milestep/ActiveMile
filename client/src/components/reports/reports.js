import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import moment                             from 'moment';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import * as utils                         from '../../utils';
import Select                             from 'react-select';
import ArticlesTabs                       from './articlesTabs';
import MonthsTabs                         from './monthsTabs';

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
      ...subscriptionActions
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

    this.state = {
      articles: null,
      isDataReady: false,
      current: {
        year: null,
        month: null,
        type: this.types[0],
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

    let { state, current, monthsNames } = {
      state: {},
      current: {},
      monthsNames: moment.monthsShort()
    };

    registers.forEach((register, i) => {
      const { article_id, counterparty_id } = register;
      const article = articles.find((art, i) => art.id === article_id);
      const counterparty = counterparties.find((cont, i) => cont.id === counterparty_id);
      const { type } = article;

      let value = type == 'Revenue' ? register.value : -register.value,
          date = new Date(register.date),
          monthIndex = date.getMonth(),
          year = date.getFullYear(),
          month = monthsNames[monthIndex],
          isExistsArticle = false,
          ultimateArticle = Object.assign({}, article, {
            counterparties: [Object.assign({}, counterparty, { value })],
            amount: value
          });

      if (!state[year]) state[year] = [];
      if (!state[year][month]) state[year][month] = {
        items: [],
        profit: 0
      };

      state[year][month]['profit'] += value;

      // Insert articles into article types
      if (state[year][month]['items'][type]) {
        state[year][month]['items'][type].forEach((art, i) => {
          if (art.id === article_id) {
            let isExistsCounterparty = false;
            isExistsArticle = true;

            art.amount += value;
            art.counterparties.forEach((c, j) => {
              if (c.id === counterparty_id) {
                c.value += value;
                isExistsCounterparty = true;
                return;
              }
            });

            if (!isExistsCounterparty) {
              counterparty['value'] = value;
              art.counterparties.push(Object.assign({}, counterparty, { value }));
            }
          }
        })

        if (!isExistsArticle) {
          state[year][month]['items'][type].push(ultimateArticle);
        }
      } else {
        state[year][month]['items'][type] = [ultimateArticle];
      }
    });

    // Create default current
    Object.assign(current, this.state.current);
    current.year = Object.keys(state)[Object.keys(state).length - 1];
    current.month = monthsNames[new Date().getMonth()];

    // Set default component state
    this.setState((prevState) => ({
      ...prevState,
      articles: state,
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
    const year = e.value;
    const monthsNames = moment.monthsShort();

    this.setState((prevState) => ({
      current: {
        ...prevState.current,
        article: null,
        year
      }
    }));
  }

  handleMonthChange = value => e => {
    e.preventDefault();
    this.setState((prevState) => ({
      current: {
        ...prevState.current,
        month: value,
        article: null
      }
    }));
  }

  handleArticleChange = id => e => {
    let article = id;

    if (this.state.current.article == id) article = null;
    this.setState((prevState) => ({
      current: {
        ...prevState.current,
        article
      }
    }));
  }

  handleChange = (field, value) => e => {
    e.preventDefault();
    this.setState((prevState) => ({
      current: {
        ...prevState.current,
        [field]: value
      }
    }));
  }

  getProfitClassNames(profit) {
    let classNames = ['profit-value'];
    if (profit > 0) classNames.push('color-green');
    if (profit < 0) classNames.push('color-red');
    return classNames;
  }

  render() {
    const { isDataReady } = this.state;

    if (!isDataReady) { return <div>Fetching data for report...</div> }

    const { articles, current } = this.state;
    const yearItems = articles[current.year];
    const { profit } = yearItems[current.month] || {
      items: [], profit: 0
    };

    let profitClassNames = this.getProfitClassNames(profit);
    let yearsOptions = [];

    for (let i in articles) {
      yearsOptions.push({ value: i, label: i });
    }

    return(
      <div>
        <div className="row">
          <div className="col-md-12 reports-filter">
            <Select
              name="years"
              className="reports-filter-select"
              onChange={this.handleYearChange.bind(this)}
              options={yearsOptions}
              value={current.year}
            />
            <MonthsTabs
              articles={articles}
              current={current}
              handleMonthChange={this.handleMonthChange.bind(this)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-9">
            <ArticlesTabs
              articles={articles}
              current={current}
              articleTypes={this.types}
              handleArticleChange={this.handleArticleChange.bind(this)}
              handleChange={this.handleChange.bind(this)}
            />
          </div>
          <div className="col-md-3">
            <div className="profit-wrapper">
              <span className="profit-title">Profit:&nbsp;</span>
              <span className={profitClassNames.join(' ')}>{profit}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
