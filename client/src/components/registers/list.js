import React, { Component, PropTypes } from 'react';
import { Link }                        from 'react-router';
import * as utils                      from '../../utils';

export default class RegistersList extends Component {
  static propTypes = {
    registers: PropTypes.array.isRequired,
    articles: PropTypes.array.isRequired,
    counterparties: PropTypes.array.isRequired,
    // handleDestroy: PropTypes.func.isRequired,
    // toggleEdited: PropTypes.func.isRequired
  };

  render() {
    const { registers, articles, counterparties } = this.props;

    const registersList = registers.map((register, i) => {
      const article = articles.find(a => a.id === register.article_id);
      const counterparty = counterparties.find(c => c.id === register.counterparty_id);

      return(
        <tr key={i}>
          <td>{register.date}</td>
          <td>{article.title}</td>
          <td>{counterparty.name}</td>
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
            </div>
          </td>
        </tr>
      )
    }).reverse();

    return(
      <tbody>
        {registersList}
      </tbody>
    );
  }
}
