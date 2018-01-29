import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'

export default class ArticlesList extends Component {
  static propTypes = {
    type: PropTypes.object.isRequired,
    displayTotal: PropTypes.bool.isRequired,
    displayAvg: PropTypes.bool.isRequired,
    fetchClassName: PropTypes.func.isRequired,
    toggleArticle: PropTypes.func.isRequired,
    openedArticles: PropTypes.array.isRequired,
    appliedFilters: PropTypes.array.isRequired
  }

  createCounterpartiesList(counterparties) {
    return counterparties.map((counterparty, index) =>(
      <div key={index}>
        <div className="row">
            <div className="col-md-2">{counterparty.item.name}</div>
            <div className={this.props.fetchClassName(this.props.displayTotal, this.props.displayAvg)}>
              {counterparty.values.map((values, index) => (
                <div key={index}>
                  <div className="col-md-1"><p>{values.value}</p></div>
                </div>
              ))}
              <div className="clearfix"></div>
            </div>
        </div>
      </div>
    ))
  }

  createArticlesList() {
    const { type, toggleArticle, openedArticles } = this.props

    const articles = type.articles.map((article, index) => (
      <div class="panel panel-default">
        <div class="panel-heading" key={index}>
        <div className="row">
          <div className="col-md-1"><p>{article.item.title}</p></div>
          <div className="col-md-1">
            <button className="btn btn-default btn-xs" onClick={(e) => toggleArticle(article.item.id)}>
              <i className={`fa fa-angle-${openedArticles.includes(article.item.id) ? "up" : "down"}`}></i>
            </button>
          </div>
            <div className={this.props.fetchClassName(this.props.displayTotal, this.props.displayAvg)}>
              {article.values.map((values, index) => (
                <div key={index}>
                  <div className="col-md-1"><p>{values.value}</p></div>
                </div>
              ))}
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
        <div class={openedArticles.includes(article.item.id) ? "panel-body" : "display_none"}>
          {this.createCounterpartiesList(article.counterparties)}
        </div>
      </div>
    ))

    return articles
  }

  render() {
    const {appliedFilters} = this.props
    const noArticles = <div class="alert alert-info">There are no articles here</div>

    return (
      <div>
        {_.isEmpty(appliedFilters) ? noArticles : this.createArticlesList()}
      </div>
    )
  }
}
