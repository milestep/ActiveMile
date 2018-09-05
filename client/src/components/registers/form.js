import React, { Component, PropTypes } from 'react';
import moment                          from 'moment';
import FormInput                       from '../layout/form/input';
import FormTextarea                    from '../layout/form/textarea';
import FormSelect                      from '../layout/form/select';
import FormDatePicker                  from '../layout/form/datePicker';
import * as utils                      from '../../utils';
import { connect }                     from 'react-redux'

@connect(
  state => ({
    currentFeatures: state.features,
  })
)
export default class RegisterForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    articles: PropTypes.array.isRequired,
    counterparties: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      register: this.createRegisterState(props),
      canSubmit: true
    };

    this.handleChange = this.handleChange.bind(this);
  }

  createRegisterState(props) {
    if (!props) props = this.props;

    const { register, articles, counterparties } = props;
    let counterpartyId, clientId, salesId, counterpartyName, clientName, salesName;

    if (register && register.counterparty) {
      counterpartyId = register.counterparty.id;
      counterpartyName = register.counterparty.name;
    }

    if (register && register.client) {
      clientId = register.client.id;
      clientName = register.client.name;
    }

    if (register && register.sales_manager) {
      salesId = register.sales_manager.id;
      salesName = register.sales_manager.name;
    }

    let forDate, forCounterparty, forArticle, forClient, forSales;

    if (this.state === undefined) {
      forDate = moment()

      forCounterparty = {
        value: null,
        label: null
      }

      forClient = {
        value: null,
        label: null
      }

      forSales = {
        value: null,
        label: null
      }

      forArticle = {
        value: articles[0].id,
        label: articles[0].title
      }
    } else {
      forDate = this.state.register.date.value

      forArticle = {
        value: this.state.register.article.value.value,
        label: this.state.register.article.value.label
      }

      forClient = {
        value: this.state.register.client.value.value,
        label: this.state.register.client.value.label
      }

      forSales = {
        value: this.state.register.sales.value.value,
        label: this.state.register.sales.value.label
      }

      forCounterparty = {
        value: this.state.register.counterparty.value.value,
        label: this.state.register.counterparty.value.label
      }
    }

    let prev = register ? {
      date: moment(Date.parse(register.date)),
      value: register.value,
      note: register.note,

      article: {
        value: register.article.id,
        label: register.article.title
      },

      client: {
        value: clientId,
        label: clientName
      },

      sales: {
        value: salesId,
        label: salesName
      },

      counterparty: {
        value: counterpartyId,
        label: counterpartyName
      }
    } : {
      date: forDate,
      value: '',
      note: '',
      article: forArticle,
      counterparty: forCounterparty,
      client: forClient,
      sales: forSales
    }, next = {};

    for (let i in prev) {
      next[i] = {};
      next[i]['value'] = prev[i];
      next[i]['blured'] = false;
    }

    return next;
  }

  handleChange = (field, values) => {
    this.setState((prevState) => ({
      register: {
        ...prevState.register,
        [field]: {
          ...prevState.register[field],
          ...values
        }
      }
    }));
  }

  handleSubmit = inputModel => {
    const { register } = this.props;
    const { article, counterparty, date, note, value, client, sales } = inputModel;

    let model = {
      date: inputModel.date.format("YYYY-MM-DD"),
      note: inputModel.note,
      value: inputModel.value,
      article_id: article.value,
      counterparty_id: counterparty ? counterparty.value : null,
      client_id: client ? client.value : null,
      sales_manager_id: sales ? sales.value : null
    }

    this.props.handleSubmit(model)
      .then(res => {
        if (this.refs.form) {
          this.setState({
            register: this.createRegisterState()
          });
        }
      });
  }

  toggleButton = status => {
    this.setState({
      canSubmit: status
    });
  }

  render() {
    const { date, value, note, article, counterparty, client, sales } = this.state.register;
    const { currentFeatures, isFetching, editing, articles, counterparties } = this.props;
    const buttonCaption = editing ? 'Update' : 'Create Register';

    let clientOptions = [];
    let salesOptions = [];
    let filteredCounterpartyOptions = [];

    const articleOptions = articles.map((article, i) => {
      return {
        value: article.id,
        label: article.title
      }
    });

    const counterpartyOptions = counterparties.map((counterparty, i) => {
      return {
        value: counterparty.id,
        label: counterparty.name,
        type: counterparty.type.toLowerCase()
      }
    });

    const optionsFilter = (type) => {
      counterpartyOptions.filter((counterparty) => {
        if (counterparty.type == type[0] || counterparty.type == type[1]) {
          counterparty.type == 'sales' ?
            salesOptions.push(counterparty)
          :
            clientOptions.push(counterparty);
        }
        filteredCounterpartyOptions.push(counterparty);
      });
    }

    optionsFilter(['sales', 'client']);

    return(
      <Formsy.Form
        ref="form"
        onValidSubmit={this.handleSubmit}
        onValid={this.toggleButton.bind(this, true)}
        onInvalid={this.toggleButton.bind(this, false)}
        className="articleForm"
      >
        <FormDatePicker
          title="Date"
          name="date"
          selected={date.value}
          handleChange={this.handleChange}
          required
        />

        <FormSelect
          title="Article"
          name="article"
          value={article.value}
          isBlured={article.blured}
          options={articleOptions}
          handleChange={this.handleChange}
          validationErrors={editing ? false : {
            isRequired: "Article is required"
          }}
          required
        />

        { (currentFeatures && currentFeatures.sales) ?
          <div>
            <FormSelect
              title="Client"
              name="client"
              value={client.value}
              isBlured={client.blured}
              options={clientOptions}
              handleChange={this.handleChange}
            />

            <FormSelect
              title="Sales manager"
              name="sales"
              value={sales.value}
              isBlured={sales.blured}
              options={salesOptions}
              handleChange={this.handleChange}
            />
          </div>
        : null }

        <FormSelect
          title="Counterparty"
          name="counterparty"
          value={counterparty.value}
          isBlured={counterparty.blured}
          options={filteredCounterpartyOptions}
          handleChange={this.handleChange}
        />

        <FormInput
          title="Value"
          name="value"
          type="number"
          value={value.value}
          isBlured={value.blured}
          handleChange={this.handleChange}
          validations="isNumeric"
          validationErrors={editing ? false : {
            isNumeric: "Value must be integer",
            isRequired: "Value is required"
          }}
          required
        />

        <FormTextarea
          title="Note"
          name="note"
          value={note.value}
          isBlured={note.blured}
          handleChange={this.handleChange}
        />

        <button
          type="submit"
          className="btn btn-success"
          disabled={!this.state.canSubmit || isFetching}
        >
          { isFetching ?
            <span className="spin-wrap">
              <span>{buttonCaption}</span>
              <i class="fa fa-circle-o-notch fa-spin"></i>
            </span>
            : buttonCaption
          }
        </button>
      </Formsy.Form>
    );
  }
}
