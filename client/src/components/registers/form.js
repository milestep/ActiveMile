import React, { Component, PropTypes } from 'react';
import moment                          from 'moment';
import FormInput                       from '../layout/form/input';
import FormTextarea                    from '../layout/form/textarea';
import FormSelect                      from '../layout/form/select';
import FormDatePicker                  from '../layout/form/datePicker';
import * as utils                      from '../../utils';

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

    let prev = register ? {
      date: moment(Date.parse(register.date)),
      value: register.value,
      note: register.note,
      article: {
        value: register.article.id,
        label: register.article.title
      },
      counterparty: {
        value: register.counterparty.id,
        label: register.counterparty.name
      }
    } : {
      date: moment(),
      value: '',
      note: '',
      article: {
        value: articles[0].id,
        label: articles[0].title
      },
      counterparty: {
        value: counterparties[0].id,
        label: counterparties[0].name
      }
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
    const { article, counterparty, date, note, value } = inputModel;

    let model = {
      date: inputModel.date.format("YYYY-MM-DD"),
      note: inputModel.note,
      value: inputModel.value,
      article_id: article.value,
      counterparty_id: counterparty.value
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
    const { date, value, note, article, counterparty } = this.state.register;
    const { isFetching, editing, articles, counterparties } = this.props;
    const buttonCaption = editing ? 'Update' : 'Create Register';

    const articleOptions = articles.map((article, i) => {
      return {
        value: article.id,
        label: article.title
      }
    });

    const counterpartyOptions = counterparties.map((counterparty, i) => {
      return {
        value: counterparty.id,
        label: counterparty.name
      }
    });

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
          dateFormat="YYYY/MM/DD"
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

        <FormSelect
          title="Counterparty"
          name="counterparty"
          value={counterparty.value}
          isBlured={counterparty.blured}
          options={counterpartyOptions}
          handleChange={this.handleChange}
          validationErrors={editing ? false : {
            isRequired: "Counterparty is required"
          }}
          required
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
