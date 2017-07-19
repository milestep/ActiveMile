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
      },
      currentRegisters: {
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

  filter() {
    const { current } = this.state;
    const monthsNames = moment.monthsShort()

    let registers = this.props.registers
    let newRegisters = []

    // витягую регістри які співпадають з фільтром/датою
    for (var i = registers.length - 1; i >= 0; i--) {
      let year = new Date(registers[i].date).getFullYear().toString()
      let month = new Date(registers[i].date).getMonth()

      if (year === current.year && monthsNames[month] === current.month) {
        let register = registers[i]

        newRegisters.push({
          id: register.id, value: register.value, date: register.date,
          article_id: register.article_id, counterparty_id: register.counterparty_id
        })
      }
    }

    registers = newRegisters
    newRegisters = []

    // щоб в articles не було повторень по counterparties
    for (var i = registers.length - 1; i >= 0; i--) {
      let bool = false
      let registerI = registers[i]

      for (var j = newRegisters.length - 1; j >= 0; j--) {
        let registerJ = newRegisters[j]

        if (registerI.id != registerJ.id && registerI.article_id === registerJ.article_id && registerI.counterparty_id === registerJ.counterparty_id) {
          let suma_values = registerI.value + registerJ.value
          newRegisters[j].value = registerJ.value + registerI.value
          bool = true
          break
        }
      }

      if (!bool) {
        newRegisters.push({
          id: registerI.id, value: registerI.value, date: registerI.date,
          article_id: registerI.article_id, counterparty_id: registerI.counterparty_id,
          article_title: this.getRegisterData('articles', 'title', registerI.article_id),
          article_type: this.getRegisterData('articles', 'type', registerI.article_id),
          counterparty_name: this.getRegisterData('counterparties', 'name', registerI.counterparty_id),
          counterparty_type: this.getRegisterData('counterparties', 'type', registerI.counterparty_id)
        })
      }
    }

    registers = newRegisters
    newRegisters = []

    // щоб в select не було повторень по article
    for (var i = registers.length - 1; i >= 0; i--) {
      let register_i = registers[i]
      let bool = false

      for (var j = newRegisters.length - 1; j >= 0; j--) {
        let register_j = newRegisters[j]

        if (register_j.article_id === register_i.article_id) {
          newRegisters[j].suma_value = newRegisters[j].suma_value + register_i.value

          newRegisters[j].counterparty.push({
            counterparty_id: register_i.counterparty_id,
            counterparty_name: register_i.counterparty_name,
            counterparty_type: register_i.counterparty_type,
            value: register_i.value
          })

          bool = true
          break
        }
      }

      if (!bool) {
        newRegisters.push({
          article_id: register_i.article_id,
          article_title: register_i.article_title,
          article_type: register_i.article_type,
          suma_value: register_i.value,
          counterparty: [{
            counterparty_id: register_i.counterparty_id,
            counterparty_name: register_i.counterparty_name,
            counterparty_type: register_i.counterparty_type,
            value: register_i.value
          }]
        })
      }
    }

    registers = newRegisters
    newRegisters = {
      cost: [],
      revenue: []
    }

    // розкидаю Cost до Cost
    for (var i = registers.length - 1; i >= 0; i--) {
      let register = registers[i]
      if (register.article_type === 'Cost') {
        newRegisters.cost.push(register)
      } else {
        newRegisters.revenue.push(register)
      }
    }

    this.state.currentRegisters = newRegisters
  }

  getRegisterData(modelName, field, id) {
    for (var i = this.props[modelName].length - 1; i >= 0; i--) {
      if (this.props[modelName][i].id === id)
        return this.props[modelName][i][field]
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

    this.filter()

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
