import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'

export default class ArticlesList extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    displayTotal: PropTypes.bool.isRequired,
    displayAvg: PropTypes.bool.isRequired,
    fetchClassName: PropTypes.func.isRequired
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
    const { filters, type } = this.props

    const articles = type.articles.map((article, index) => (
      <div class="panel panel-default">
        <div class="panel-heading" key={index}>
        <div className="row">
          <div className="col-md-2"><p>{article.item.title}</p></div>
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
        <div class="panel-body">
          {this.createCounterpartiesList(article.counterparties)}
        </div>
      </div>
    ))

    return articles
  }

  render() {
    return (
      <div>
        {this.createArticlesList()}
      </div>
    )
  }
}
