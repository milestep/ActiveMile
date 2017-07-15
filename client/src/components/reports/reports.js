import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import moment                             from 'moment';
import { actions as subscriptionActions } from '../../actions/subscriptions';
import * as utils                         from '../../utils';
import Select                             from 'react-select';
import ArticlesList                       from './articlesList';
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
        article: null
      }
      currentRegisters: {
        all: [],
        cost: [],
        revenue: []
      },
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
      const registerArticle = articles.find((art, i) => art.id === article_id);
      const registerCounterparty = counterparties
              .find((cont, i) => cont.id === counterparty_id) ||
              { id: null, name: '-' }
      const { type } = registerArticle;

      let value = type == 'Revenue' ? register.value : -register.value,
          date = new Date(register.date),
          monthIndex = date.getMonth(),
          year = date.getFullYear(),
          month = monthsNames[monthIndex],
          isExistsArticle = false,
          stateYear = state[year] = state[year] || [],
          stateMonth = stateYear[month] = stateYear[month] || {
            items: [],
            profit: 0
          },
          currentItems = stateMonth['items'],
          ultimateArticle = Object.assign({}, registerArticle, {
            counterparties: [Object.assign({}, registerCounterparty, { value })],
            amount: value
          });

      stateMonth['profit'] += value;

      if (currentItems) {
        currentItems.forEach((article, i) => {
          if (article.id === article_id) {
            let isExistsCounterparty = false;
            isExistsArticle = true;

            article.amount += value;
            article.counterparties.forEach((counterparty, j) => {
              if (counterparty.id === counterparty_id) {
                counterparty.value += value;
                isExistsCounterparty = true;
                return;
              }
            });

            if (!isExistsCounterparty) {
              article.counterparties.push(
                Object.assign({}, registerCounterparty, { value })
              );
            }
          }
        })

        if (!isExistsArticle) {
          currentItems.push(ultimateArticle);
        }
      } else {
        stateMonth['items'] = [ultimateArticle];
      }
    });

    Object.assign(current, this.state.current);
    current.year = Object.keys(state)[Object.keys(state).length - 1];
    current.month = monthsNames[new Date().getMonth()];

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

  filter(current) {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    this.state.currentRegisters = {
      all: [],
      cost: [],
      revenue: []
    }

    for (var i = this.props.registers.length - 1; i >= 0; i--) {
      let year = new Date(this.props.registers[i].date).getFullYear().toString()
      let month = new Date(this.props.registers[i].date).getMonth()

      if (year === current.year && months[month] === current.month) {
        let register = this.props.registers[i]

        this.state.currentRegisters.all.push({
          id: register.id, date: register.date, value: register.value,
          article_id: register.article_id, counterparty_id: register.counterparty_id,
          article_title: this.getRegisterData('article_title', register.article_id),
          article_type: this.getRegisterData('article_type', register.article_id),
          counterparty_name: this.getRegisterData('counterparty_name', register.counterparty_id),
          counterparty_type: this.getRegisterData('counterparty_type', register.counterparty_id)
        })
      }
    }

    // розкидаю Cost до Cost
    for (var i = this.state.currentRegisters.all.length - 1; i >= 0; i--) {
      let register = this.state.currentRegisters.all[i]
      if (register.article_type === 'Cost') {
        this.state.currentRegisters.cost.push(register)
      } else {
        this.state.currentRegisters.revenue.push(register)
      }
    }

    this.finalStatusRegisters('Cost')
    this.finalStatusRegisters('Revenue')
  }

  finalStatusRegisters(model) {
    let usedStateModel = []

    if (model === 'Cost') {
      usedStateModel = this.state.currentRegisters.cost
    } else {
      usedStateModel = this.state.currentRegisters.revenue
    }

    // щоб в select не було повторень по article
    let forModelArr = []

    for (var i = usedStateModel.length - 1; i >= 0; i--) {
      let register_i = usedStateModel[i]
      let bool = false

      for (var j = forModelArr.length - 1; j >= 0; j--) {
        let register_j = forModelArr[j]

        if (register_j.article_id === register_i.article_id) {
          forModelArr[j].suma_value = forModelArr[j].suma_value + register_i.value

          forModelArr[j].counterparty.push({
            counterparty_name: register_i.counterparty_name,
            counterparty_type: register_i.counterparty_type,
            value: register_i.value
          })

          bool = true
          break
        }
      }

      if (!bool) {
        forModelArr.push({
          article_id: register_i.article_id,
          article_title: register_i.article_title,
          article_type: register_i.article_type,
          suma_value: register_i.value,
          counterparty: [{
            counterparty_name: register_i.counterparty_name,
            counterparty_type: register_i.counterparty_type,
            value: register_i.value
          }]
        })
      }
    }

    if (model === 'Cost') {
      this.state.currentRegisters.cost = forModelArr
    } else {
      this.state.currentRegisters.revenue = forModelArr
    }
  }

  getRegisterData(model, id) {
    if (model === "article_title") {
      for (var i = this.props.articles.length - 1; i >= 0; i--) {
        if (this.props.articles[i].id === id)
          return this.props.articles[i].title
      }
    } else if (model === "article_type") {
      for (var i = this.props.articles.length - 1; i >= 0; i--) {
        if (this.props.articles[i].id === id)
          return this.props.articles[i].type
      }
    } else if (model === "counterparty_name") {
      for (var i = this.props.counterparties.length - 1; i >= 0; i--) {
        if (this.props.counterparties[i].id === id)
          return this.props.counterparties[i].name
      }
    } else if (model === "counterparty_type") {
      for (var i = this.props.counterparties.length - 1; i >= 0; i--) {
        if (this.props.counterparties[i].id === id)
          return this.props.counterparties[i].type
      }
    }
  }

  render() {
    const { isDataReady } = this.state;

    if (!isDataReady) { return(
      <span className="spin-wrap main-loader">
        <i class="fa fa-spinner fa-spin fa-3x"></i>
      </span>
    ); }

    const { articles, current } = this.state;
    const yearItems = articles[current.year];
    const { profit } = yearItems[current.month] || {
      items: [], profit: 0
    };

    let yearsOptions = [];

    for (let i in articles) {
      yearsOptions.push({ value: i, label: i });
    }

    this.filter(current)

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
          <div className="col-md-2"><h3>Total:</h3></div>
          <div className="col-md-10">
            <h3 className={profit > 0 ? 'color-green' : 'color-red'}>{profit}</h3>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-md-6">
            <ArticlesList
              modelRegister="Revenue"
              currentRegisters={this.state.currentRegisters.revenue}
              currentArticleId={current.article}
              handleArticleChange={this.handleArticleChange.bind(this)}
            />
          </div>
          <div className="col-md-6">
            <ArticlesList
              modelRegister="Cost"
              currentRegisters={this.state.currentRegisters.cost}
              currentArticleId={current.article}
              handleArticleChange={this.handleArticleChange.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}
