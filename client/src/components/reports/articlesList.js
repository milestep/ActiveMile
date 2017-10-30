import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux';
import { connect }                      from 'react-redux';
import * as utils                       from '../../utils';
import moment                             from 'moment';

const monthsNames = moment.monthsShort()

export default class TestArticlesList extends Component {
  static propTypes = {
    collapsedArticles: PropTypes.array,
    currentMonths: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    articles: PropTypes.object.isRequired,
    handleArticleChange: PropTypes.func.isRequired
  }

  createArticlesList() {
    const { articles, collapsedArticles, currentMonths, type } = this.props
    let res = [];

    for(let articleTitle in articles) {
      const { counterparties } = articles[articleTitle]
      const isCollapsed = collapsedArticles.indexOf(articleTitle) === -1

      res.push(
        <div className='panel panel-default article-panel' key={articleTitle}>
          <div class='panel-heading'>
            <div className='row'>
              <div className='col-xs-2'>
                <div className='row'>
                  <div className='col-xs-3 article-expand-wrapper'>
                    <button
                      className='btn btn-default article-expand-btn btn-xs'
                      onClick={(e) => this.props.handleArticleChange(articleTitle, type)}
                    >
                      <i class={`fa fa-angle-${isCollapsed ? 'down' : 'up'}`}></i>
                    </button>
                  </div>
                  <div className='col-xs-9'>
                    { articleTitle }
                  </div>
                </div>
              </div>
              <div className='col-md-9 reports-list-align-right'>
                { this.createValuesByMonths(articles[articleTitle]['values']) }
              </div>
            </div>
          </div>

          { isCollapsed ?
            null
          :
            <div className='panel-body'>
              { this.createCounterpartiesList(counterparties) }
            </div>
          }
        </div>
      )
    }

    return res
  }

  createCounterpartiesList(counterparties) {
    const { type } = this.props
    let res = [];

    for(let name in counterparties) {
      res.push(
        <div className={`counterparty-wrapper type-${type}`} key={name}>
          <div className='row'>
            <div className='col-md-2 counterparty-name'>{ name || '-' }</div>
              <div className='col-md-9 reports-list-align-right'>
                {this.createValuesByMonths(counterparties[name])}
              </div>
          </div>
        </div>
      )
    }

    return res
  }

  createValuesByMonths(months) {
    const { currentMonths } = this.props
    let res = [];

    currentMonths.map((numMonth, index) => {
      res.push(
        <div key={index} className='col-xs-1 counterparty-value'>{ months[monthsNames[numMonth]] }</div>
      )
    })

    return res
  }

  renderEmptyList() {
    return (
      <div className='alert alert-info'>
        <span>There are no articles here</span>
      </div>
    )
  }

  render() {
    const { articles } = this.props

    return (
      <div className='reports-list-item'>
        { Object.keys(articles).length ? this.createArticlesList() : this.renderEmptyList() }
      </div>
    )
  }
}
