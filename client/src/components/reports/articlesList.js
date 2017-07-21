import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux';
import { connect }                      from 'react-redux';
import * as utils                       from '../../utils';

export default class ArticlesList extends Component {
  static propTypes = {
    collapsedArticles: PropTypes.array,
    type: PropTypes.string.isRequired,
    articles: PropTypes.array.isRequired,
    handleArticleChange: PropTypes.func.isRequired
  }

  createArticlesList() {
    const { articles, collapsedArticles } = this.props

    return articles.map((article, index) => {
      const isCollapsed = collapsedArticles.indexOf(article.id) === -1
      const { counterparties } = article

      return(
        <div className='panel panel-default' key={index}>
          <div class="panel-heading">
            <div className='row'>
              <div className='col-md-9'>{ article.title }</div>
              <div className='col-md-2'>{ article.value }</div>
              <div className='col-md-1'>
                <button
                  className='btn btn-default article-expand btn-xs'
                  onClick={(e) => this.props.handleArticleChange(article.id, article.type)(e)}
                >
                  <i class={`fa fa-angle-${isCollapsed ? 'up' : 'down'}`}></i>
                </button>
              </div>
            </div>
          </div>

          { isCollapsed ?
            <div className='panel-body'>
              { this.createCounterpartiesList(counterparties) }
            </div>
          : null }

        </div>
      )
    })
  }

  createCounterpartiesList(counterparties) {
    return counterparties.map((counterparty, index) => {
      return(
        <div key={index}>
          <div className='row'>
            <div className='col-md-9'>{ counterparty.name || '-' }</div>
            <div className='col-md-3'>{ counterparty.value }</div>
          </div>
        </div>
      )
    })
  }

  renderEmptyList() {
    return (
      <div className="alert alert-info">
        <span>There are no articles here</span>
      </div>
    )
  }

  render() {
    const { articles } = this.props

    return (
      <div>{ articles.length ? this.createArticlesList() : this.renderEmptyList() }</div>
    )
  }
}
