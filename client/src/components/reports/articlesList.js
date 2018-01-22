import React, { Component, PropTypes }  from 'react'
import { connect }                      from 'react-redux'

export default class ArticlesList extends Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    type: PropTypes.array.isRequired
  }

  createCounterpartiesList(counterparties) {
    return counterparties.map((counterparty, index) =>(
      <div key={index}>
        <div className="col-md-2">{counterparty.item.name}</div>
        <div className="col-md-1">{counterparty.value}</div>
        <div className="clearfix"></div>
      </div>
    ))
  }

  createArticlesList() {
    const { filters, type } = this.props

    const articles = type.map((type) => (
      type.articles.map((article, index, title) => (
        <div className="col-md-1" key={index}>{article.item.title}</div>
      ))
    ))

    return articles
  }

  render() {
    return (
      <div className="col-md-12">
        {this.createArticlesList()}
      </div>
    )
  }
}
