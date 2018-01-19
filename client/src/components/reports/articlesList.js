import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux';
import { connect }                      from 'react-redux';
import * as utils                       from '../../utils';
import filter                             from '../../lib/filter'
import MonthsStrategy                     from '../../strategies/filter/months'
import YearsStrategy                      from '../../strategies/filter/years'
import Filter                             from './filter'
import ReportsStateCreator                from './stateCreators'

export default class articlesList extends Component {
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
    const {filters, type} = this.props

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
