import React, { Component, PropTypes } from 'react';
import { bindActionCreators }          from 'redux';
import { connect }                     from 'react-redux';
import * as queryString                from 'query-string';
import { getCurrentUser }              from '../../utils/currentUser';
import { toaster }                     from '../../actions/alerts';
import { actions as articleActions }   from '../../resources/article';
import ArticlesList                    from './list';
import ArticleForm                     from './form';

@connect(
  state => ({
    articles: state.articles.items,
    isCreating: state.articles.isCreating,
    currentWorkspace: state.workspaces.app.currentWorkspace
  }), 
  dispatch => ({
    actions: bindActionCreators({
      ...articleActions,
      toaster
    }, dispatch)
  })
)
export default class Articles extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    articles: PropTypes.array.isRequired,
    isCreating: PropTypes.bool.isRequired
  };

  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    const { articles } = props;

    this.types = ['Revenue', 'Cost'];

    this.state = {
      articles: this.getArticlesState(articles),
      currentType: this.types[0],
      editedArticle: null
    };

    this.toaster = props.actions.toaster();
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
    this.toggleEdited = this.toggleEdited.bind(this);
  }

  componentDidMount() {
    const { currentWorkspace } = this.props;

    if (currentWorkspace) {
      this.fetchArticles(currentWorkspace.id);
    }
  }

  componentWillReceiveProps(newProps) {
    const { currentWorkspace, articles } = newProps;
    const prevWorkspace = this.props.currentWorkspace;
    const prevArticles = this.state.articles;

    if (currentWorkspace && currentWorkspace !== prevWorkspace) {
      this.fetchArticles(currentWorkspace.id);
    }

    if (articles !== prevArticles) {
      this.setState({
        articles: this.getArticlesState(articles),
      });
    }
  }

  getArticlesState(articles) {
    let all = { all: [ ...articles ] }, 
        types = {},
        ids = []

    articles.forEach((article, j) => {
      const { type } = article;

      if (!types[type]) types[type] = [];
      ids.push(article.id);
      types[type].push(article);
    });
    return Object.assign({ ids }, all, types);
  }

  fetchArticles(id) {
    const { actions } = this.props;

    actions.fetchArticles()
      .catch(err => {
        this.toaster.error('Could not load articles!');
      });
  }

  switchToType(type) {
    this.setState((prevState) => ({
      ...prevState,
      currentType: type
    }));
  }

  handleCreate(article) {
    return new Promise((resolve, reject) => {
      const { actions, currentWorkspace } = this.props;
      const { type } = article;

      article['type'] = type.label;
      actions.createArticle({ article })
        .then(res => {
          this.toaster.success('Article has been created');
          resolve(res);
        })
        .catch(err => {
          this.toaster.error('Could not create article!');
          reject(err);
        });
    })
  } 

  handleUpdate(article) {
    return new Promise((resolve, reject) => {
      const { actions, dispatch, currentWorkspace } = this.props;
      const { store } = this.context;
      const { id, type } = article;
      const { ids } = this.state.articles;

      delete article.id;
      article['type'] = type.label;

      actions.updateArticle({ id, article })
        .then(res => {
          const articles = this.state.articles.all;
          const index = ids.indexOf(id);

          articles.splice(index, 0, articles.shift())

          store.dispatch({ type: '@@resource/ARTICLE/FETCH',
                           status: 'resolved',
                           body: articles });

          this.setState({
            articles: this.getArticlesState(articles)
          });

          this.toggleEdited(id, false);
          this.toaster.success('Article has been updated');
          resolve(res);
        })
        .catch(err => {
          this.toaster.error('Could not update article!');
          reject(err);
        });
    })
  }

  handleDestroy(id) {
    const { actions } = this.props;

    actions.deleteArticle(id)
      .then(res => {
        this.toaster.success('Article was successfully deleted!');
      })
      .catch(err => {
        this.toaster.error('Could not delete article!');
      })
  }

  toggleEdited(id, status) {
    let { editedArticle } = this.state;

    if (status) {
      editedArticle = id;
    } else {
      editedArticle = null;
    }

    this.setState({
      editedArticle: editedArticle
    });
  }

  createTabsTemplate() {
    const { 
      articles,
      currentType,
      editedArticle
    } = this.state;

    let list    = [],
        content = [];

    this.types.forEach((type, i) => {
      const isCurrent = type === currentType ? true : false;
      const isFirst = i === 0 ? true : false;

      list.push(
        <li className={isCurrent ? 'active' : ''} key={i}>
          <a onClick={this.switchToType.bind(this, type)}>{type}</a>
        </li>
      );

      content.push(
        <div key={i}
          className={`tab-pane fade${
            isCurrent ? ' active in' : ''
          }${
            isCurrent && isFirst ? ' first' : ''
          }`}
        >
          <ArticlesList
            types={this.types}
            articles={articles[type] || []}
            editedArticle={editedArticle}
            handleUpdate={this.handleUpdate}
            handleDestroy={this.handleDestroy}
            toggleEdited={this.toggleEdited}
          />
        </div>
      );
    });
    
    return { list, content }
  }

  render() {
    const currentUser = getCurrentUser();
    const { isCreating } = this.props;
    const { editedArticle } = this.state;
    const tabs = this.createTabsTemplate();

    return(
      <div>
        <h3>Articles</h3>

        <div className="row">
          <div className="col-md-8">
            <div className="articles-tabs">
              <ul class="nav nav-tabs">
                {tabs.list}
              </ul>
              <div className="tab-content">
                {tabs.content}
              </div>
            </div>
          </div>
          { currentUser ?
            <div className="col-md-4">
              <ArticleForm 
                types={this.types}
                fetching={isCreating}
                handleSubmit={this.handleCreate}
              />
            </div>
          : null }
        </div>
      </div>
    );
  }
}
