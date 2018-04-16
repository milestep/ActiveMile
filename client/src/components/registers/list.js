import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux'
import { Link }                        from 'react-router';
import * as utils                      from '../../utils';
import moment                          from 'moment';
import InfiniteScroll                   from 'react-infinite-scroller';

@connect(
  state => ({
    currentFeatures: state.features,
    registers: state.registers.items
  })
)
export default class RegistersList extends Component {
  static propTypes = {
    registers: PropTypes.array.isRequired,
    articles: PropTypes.array.isRequired,
    counterparties: PropTypes.array.isRequired,
    handleDestroy: PropTypes.func.isRequired
  };

  loadFunc() {
    console.log('loading...')
    return null
  }

  render() {
    const { registers, articles, counterparties, handleDestroy, currentFeatures } = this.props;

    const registersList = registers.map((register, i) => {
      const article = articles.find(a => a.id === register.article_id) || {}
      const typeName = article.type == "Cost" ? 'cost' : 'revenue';
      const counterparty = counterparties.find(c => c.id === register.counterparty_id) || {}
      const client = counterparties.find(c => c.id === register.client_id) || {}
      const manager = counterparties.find(c => c.id === register.sales_manager_id) || {}

      return(
        <tr className="register-table" key={i}>
          <td>{ moment(register.date).format("DD-MM-YYYY") }</td>
          <td>
            {article.title}
            <span className={`register-title-label ${typeName}`}>
              &nbsp;({typeName})
            </span>
          </td>

          { (currentFeatures && currentFeatures.sales) ?
            <td>{ client.name }</td>
          : null }

          { (currentFeatures && currentFeatures.sales) ?
            <td>{ manager.name }</td>
          : null }

          <td>{counterparty ? counterparty.name : '-'}</td>
          <td>{register.value}</td>
          <td><div className="register-note">{register.note}</div></td>
          <td>
            <div className="btn-group btns-hidden" >
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

    if (registers.length) {
      return (
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadFunc.bind(this)}
          hasMore={true}
          loader={<tr className="loader" key={0}><td>Loading ...</td></tr>}
          element={'tbody'}
        >
          { registersList }
        </InfiniteScroll>
      )
    }

    return(
      <tbody>
        <tr>
          <td rowSpan="6">
            There are no registers...
          </td>
        </tr>
      </tbody>
    );
  }
}
