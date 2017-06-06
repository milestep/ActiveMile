import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import * as utils                         from '../../utils';

export default class ArticlesList extends Component {
  static propTypes = {
    articles: PropTypes.object.isRequired,
    current: PropTypes.object.isRequired,
    handleArticleChange: PropTypes.func.isRequired
  };

  render() {
    const { articles, current, handleArticleChange } = this.props;
    const yearItems = articles[current.year];
    const currentArticles = (yearItems[current.month] || {
      items: [], profit: 0
    })['items'];

    const articlesList = !utils.empty(currentArticles) ? currentArticles.map((article, j) => {
      const isExpanded = current.article == article.id;
      const depsList = article.counterparties.map((counterparty, k) => {
        const { name, value } = counterparty;
        let valueClassNames = ['dep-value'];

        if (value > 0) valueClassNames.push('color-green');
        if (value < 0) valueClassNames.push('color-red');

        return(
          <li className="dep-list-item" key={k}>
            <div className="left-side">
              <span className="dep-title">{name}</span>
            </div>
            <div className="right-side">
              <span className={valueClassNames.join(' ')}>{value}</span>
            </div>
          </li>
        );
      });

      return (
        <li className={
          `list-group-item reports-filter-article${isExpanded ? '': ' expanded'}`
        } key={j}>
          <div className="article-overlap">
            <div className="left-side">
              <span className="article-title">
                {article.title}
              </span>
            </div>
            <div className="right-side">
              <span className="article-amount">
                {article.amount}
              </span>
              <button
                className="btn btn-default article-expand"
                onClick={(e) => handleArticleChange(article.id)(e)}
              >
                <i class={`fa fa-angle-${isExpanded ? 'up' : 'down'}`}></i>
              </button>
            </div>
          </div>
          <ul className="article-depths-overlap">
            {depsList}
          </ul>
        </li>
      );
    }) : (
      <li className="list-group-item no-exists">
        <div className="alert alert-info">
          <span>There are no articles here</span>
        </div>
      </li>
    );

    return(
      <div className="reports-filter-articles-list">
        {articlesList}
      </div>
    );
  }
}
