import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import ArticlesListItem                from './list/item';

@connect(
  state => ({
    isFetching: state.articles.isFetching
  })
)
export default class ArticlesList extends Component {
  static propTypes = {
    articles: PropTypes.array.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handleDestroy: PropTypes.func.isRequired,
    toggleEdited: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isFetching: true
    }

    this.handleUpdate = props.handleUpdate;
    this.handleDestroy = props.handleDestroy;
    this.toggleEdited = props.toggleEdited;
  }

  componentWillReceiveProps(newProps) {
    const prevFetching = this.state.isFetching;
    const { isFetching } = newProps;

    if (isFetching !== prevFetching) {
      this.setState({
        isFetching: isFetching
      });
    }
  }

  render() {
    const { types, isFirst, articles, editedArticle } = this.props;
    const { isFetching } = this.state;

    let articlesList = [];

    if (articles && articles.length) {
      articles.forEach((article, i) => {
        const { id } = article;
        const isEdited = editedArticle === id ? true : false;

        articlesList.unshift(
          <ArticlesListItem 
            key={i}
            types={types}
            article={article}
            isEdited={isEdited}
            handleUpdate={this.handleUpdate}
            handleDestroy={this.handleDestroy}
            toggleEdited={this.toggleEdited}
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
              <span>There is no articles here</span>
            }
          </div>
        </li>
      )
    }

    return <div>{articlesList}</div>;
  }
}
