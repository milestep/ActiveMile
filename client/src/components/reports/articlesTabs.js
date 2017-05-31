import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import * as utils                         from '../../utils';

export default class ArticlesTabs extends Component {
  static propTypes = {
    articles: PropTypes.object.isRequired,
    current: PropTypes.object.isRequired,
    articleTypes: PropTypes.array.isRequired,
    handleArticleChange: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired
  };

  render() {
    const {
      articles,
      current,
      articleTypes,
      handleArticleChange,
      handleChange
    } = this.props;

    const yearItems = articles[current.year];
    const monthItems = yearItems[current.month] || {
      items: [], profit: 0
    };

    let tabs    = [],
        content = [];

    articleTypes.forEach((typeName, i) => {
      let isFirst = i === 0,
          isCurrent = current.type == typeName,
          currentArticles = monthItems['items'][typeName],
          articlesList;

      if (currentArticles) {
        articlesList = currentArticles.map((article, j) => {
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
        });
      } else {
        articlesList = (
          <li className="list-group-item">
            <div className="alert alert-info">
              <span>There are no articles here</span>
            </div>
          </li>
        );
      }

      tabs.push(
        <li className={isCurrent ? "active": ""} key={typeName}>
          <a
            href="#"
            onClick={(e) => handleChange('type', typeName)(e)}
          >{typeName}</a>
        </li>
      );
      content.push(
        <div key={typeName}
          className={`tab-pane fade${
            isCurrent ? ' active in' : ''}${
            isCurrent && isFirst ? ' first' : ''
          }`}
        >
          {articlesList}
        </div>
      );
    });

    return(
      <div className="site-tabs reports-filter-articles-tabs">
        <ul class="nav nav-tabs">{tabs}</ul>
        <div className="tab-content">{content}</div>
      </div>
    );
  }
}
