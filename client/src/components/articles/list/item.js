import React, { Component, PropTypes } from 'react';
import { bindActionCreators }          from 'redux';
import { connect }                     from 'react-redux';
import { getCurrentUser }              from '../../../utils/currentUser';
import ArticleForm                     from '../form';

export default class ArticlesListItem extends Component {
  static propTypes = {
    article: PropTypes.object.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handleDestroy: PropTypes.func.isRequired,
    toggleEdited: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.handleUpdate = props.handleUpdate;
    this.handleDestroy = props.handleDestroy;
    this.toggleEdited = props.toggleEdited;
  }

  render() {
    const currentUser = getCurrentUser();
    const { types, article, isEdited, isUpdating } = this.props;
    const { id, title, type } = article;

    return(
      <li className="list-group-item" >
        { isEdited ? 
          <div className="inline-form">
            <ArticleForm
              editing={true}
              fetching={isUpdating}
              types={types}
              article={article}
              handleSubmit={this.handleUpdate}
            />
            <div className="form-btn-wrap">
              <button
                className="btn btn-sm btn-primary"
                onClick={this.toggleEdited.bind(this, id, false)}
              >
                <i class="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          :
          <div className="articles-overlap">
            <div className="article-info">
              <span className="article-title">
                {title}
              </span>
            </div>
            <div className="article-actions btn-group">
              { currentUser ? 
                <button
                  className="btn btn-sm btn-primary"
                  onClick={this.toggleEdited.bind(this, id, true)}
                >
                  <i class="fa fa-pencil" aria-hidden="true"></i>
                </button>
              : null }
              { currentUser ? 
                <button
                  className="btn btn-sm btn-danger"
                  onClick={this.handleDestroy.bind(this, id)}
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
