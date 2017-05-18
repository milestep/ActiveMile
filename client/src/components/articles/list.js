import React, { Component, PropTypes } from 'react';
import ArticlesListItem                from './list/item';
import * as utils                      from '../../utils';

export default class ArticlesList extends Component {
  static propTypes = {
    articles: PropTypes.array.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handleDestroy: PropTypes.func.isRequired,
    toggleEdited: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired
  };

  render() {
    const { props } = this;
    const { articles, isFetching } = props;

    let articlesList = [];

    if (!utils.empty(articles)) {
      articles.forEach((article, i) => {
        const { id } = article;
        const isEdited = props.editedArticle === id ? true : false;

        articlesList.unshift(
          <ArticlesListItem
            key={i}
            types={props.types}
            article={article}
            isEdited={isEdited}
            handleUpdate={props.handleUpdate}
            handleDestroy={props.handleDestroy}
            toggleEdited={props.toggleEdited}
          />
        );
      });
    } else {
      articlesList = (
        <li className="list-group-item">
          <div className="alert alert-info">
            { isFetching ?
              <span className="spin-wrap">
                <i class="fa fa-spinner fa-spin fa-2x"></i>
              </span>
            :
              <span>There are no articles here</span>
            }
          </div>
        </li>
      )
    }

    return <div>{articlesList}</div>;
  }
}
