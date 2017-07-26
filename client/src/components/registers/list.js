import React, { Component, PropTypes } from 'react';
import { Link }                        from 'react-router';
import * as utils                      from '../../utils';
import moment                          from 'moment';

export default class RegistersList extends Component {
  static propTypes = {
    registers: PropTypes.array.isRequired,
    articles: PropTypes.array.isRequired,
    counterparties: PropTypes.array.isRequired,
    handleDestroy: PropTypes.func.isRequired
  };

  render() {
    const { registers, articles, counterparties, handleDestroy } = this.props;

    const registersList = registers.map((register, i) => {
      const article = articles.find(a => a.id === register.article_id) || {}
      const counterparty = counterparties.find(c => c.id === register.counterparty_id) || {}
      const typeName = article.type == "Cost" ? 'cost' : 'revenue';

      return(
        <tr key={i}>
          <td>{ moment(register.date).format("DD-MM-YYYY") }</td>
          <td>
            {article.title}
            <span className={`register-title-label ${typeName}`}>
              &nbsp;({typeName})
            </span>
          </td>
          <td>{counterparty ? counterparty.name : '-'}</td>
          <td>{register.value}</td>
          <td>{register.note}</td>
          <td>
            <div className="btn-group">
               <Link
                  to={`/registers/${register.id}/edit`}
                  className="btn btn-primary btn-sm"
                >
                  <i className="glyphicon glyphicon-pencil"></i>
              </Link>
              <button
                className="btn btn-sm btn-danger"
                onClick={handleDestroy.bind(this, register.id)}
              >
                <i class="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </td>
        </tr>
      )
    }).reverse()

    return(
      <tbody>
        { registers.length ?
          registersList :
          <tr>
            <td rowSpan="6">
              There are no registers...
            </td>
          </tr>
        }
      </tbody>
    );
  }
}
