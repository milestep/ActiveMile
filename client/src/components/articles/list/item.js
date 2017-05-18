import React, { Component, PropTypes } from 'react';
import { bindActionCreators }          from 'redux';
import { connect }                     from 'react-redux';
import { getCurrentUser }              from '../../../helpers/currentUser';
import ArticleForm                     from '../form';

@connect(
  state => ({
    isUpdating: state.articles.isUpdating
  })
)
export default class ArticlesListItem extends Component {
  static propTypes = {
    article: PropTypes.object.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handleDestroy: PropTypes.func.isRequired,
    toggleEdited: PropTypes.func.isRequired,
    isUpdating: PropTypes.bool
  };

  render() {
    const currentUser = getCurrentUser();
    const { props } = this;
    const { article } = this.props;
    const { id, title, type } = article;

    return(
      <li className="list-group-item">
        { props.isEdited ?
          <div className="inline-form">
            <ArticleForm
              editing={true}
              fetching={props.isUpdating}
              types={props.types}
              article={article}
              handleSubmit={props.handleUpdate}
            />
            <div className="form-btn-wrap">
              <button
                className="btn btn-sm btn-primary"
                onClick={props.toggleEdited.bind(this, id, false)}
              >
                <i class="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          :
          <div className="tabs-overlap">
            <div className="article-info">
              <span className="article-title">
                {title}
              </span>
            </div>
            <div className="article-actions btn-group">
              { currentUser ?
                <button
                  className="btn btn-sm btn-primary"
                  onClick={props.toggleEdited.bind(this, id, true)}
                >
                  <i class="fa fa-pencil" aria-hidden="true"></i>
                </button>
              : null }
              { currentUser ?
                <button
                  className="btn btn-sm btn-danger"
                  onClick={props.handleDestroy.bind(this, id)}
                >
                  <i class="fa fa-times" aria-hidden="true"></i>
                </button>
              : null }
            </div>
          </div>
        }
      </li>
    );
  }
}
