import React, { Component, PropTypes }  from 'react';
import { bindActionCreators }           from 'redux';
import { connect }                      from 'react-redux';
import * as utils                       from '../../utils';
import moment                             from 'moment';

const monthsNames = moment.monthsShort()

export default class TestArticlesList extends Component {
  static propTypes = {
    collapsedArticles: PropTypes.array,
    type: PropTypes.string.isRequired,
    articles: PropTypes.object.isRequired,
    handleArticleChange: PropTypes.func.isRequired
  }

  createArticlesList() {
    const { articles, collapsedArticles, currentMonths, type } = this.props
    // let activeCurrentMonths = [];

    // report {
    //   cost: {
    //     titleArticle: {
    //       id, title
    //       month: [
    //         Aug: [counterparty...],
    //         Jun: [counterparty...],
    //       ]
    //     }
    //     Den: []
    //   }
    //   revenue: []
    // }



    console.log(articles)

    // monthsNames
    // return monthsNames.map((month, index) => {
    //   month
    // })

    let ArticleTitleByMonth = []

    for (let month in articles) {
      const nawArticles = articles[month][type]
      // console.log(nawArticles)

      for (var i = nawArticles.length - 1; i >= 0; i--) {
        console.log(nawArticles[i])

        if (ArticleTitleByMonth.length) {

        } else {
          ArticleTitleByMonth.push(nawArticles)
        }
        // for (var i = ArticleTitleByMonth.length - 1; i >= 0; i--) {
        //   ArticleTitleByMonth[i]
        // }

        //
      }
    }


    // monthsNames.forEach((month, index) => {
    //   const isCurrent = currentMonths.includes(monthsNames.indexOf(month))
    //   // console.log(articles[month][type])

    //   if (isCurrent) {
    //     activeCurrentMonths.push(
    //       <div className='col-md-12' key={month}>
    //         { this.createArticlesList2(articles[month][type]) }
    //       </div>
    //     )
    //   }
    // });

    console.log('ArticleTitleByMonth', ArticleTitleByMonth)
    // return activeCurrentMonths




    // return articles.map((article, index) => {
    //   const isCollapsed = collapsedArticles.indexOf(article.id) === -1
    //   const { counterparties } = article

    //   return(
    //     <div className='panel panel-default article-panel' key={index}>
    //       <div class='panel-heading'>
    //         <div className='row'>
    //           <div className='col-md-9 article-title'>{ article.title }</div>
    //           <div className='col-md-2 article-value'>{ article.value }</div>
    //           <div className='col-md-1 article-expand-wrapper'>
    //             <button
    //               className='btn btn-default article-expand-btn btn-xs'
    //               onClick={(e) => this.props.handleArticleChange(article.id, article.type)}
    //             >
    //               <i class={`fa fa-angle-${isCollapsed ? 'up' : 'down'}`}></i>
    //             </button>
    //           </div>
    //         </div>
    //       </div>

    //       { isCollapsed ?
    //         <div className='panel-body'>
    //           { this.createCounterpartiesList(counterparties) }
    //         </div>
    //       : null }

    //     </div>
    //   )
    // })
  }

  createArticlesList2(articles) {

    const {  collapsedArticles, currentMonths, type } = this.props
    // console.log(articles)

    return articles.map((article, index) => {
      const isCollapsed = collapsedArticles.indexOf(article.id) === -1
      const { counterparties } = article

      return(
        <div className='panel panel-default article-panel' key={index}>
          <div class='panel-heading'>
            <div className='row'>
              <div className='col-md-2 article-title'>{ article.title }</div>
              <div className='col-md-1 article-value'>{ article.value }</div>
              <div className='col-md-1 article-expand-wrapper'>
                <button
                  className='btn btn-default article-expand-btn btn-xs'
                  onClick={(e) => this.props.handleArticleChange(article.id, article.type)}
                >
                  <i class={`fa fa-angle-${isCollapsed ? 'up' : 'down'}`}></i>
                </button>
              </div>
            </div>
          </div>

          { /*isCollapsed ?
            <div className='panel-body'>
              { this.createCounterpartiesList(counterparties) }
            </div>
          : null */}

        </div>
      )
    })





    // return articles.map((article, index) => {
    //   const isCollapsed = collapsedArticles.indexOf(article.id) === -1
    //   const { counterparties } = article

    //   return(
    //     <div className='panel panel-default article-panel' key={index}>
    //       <div class='panel-heading'>
    //         <div className='row'>
    //           <div className='col-md-9 article-title'>{ article.title }</div>
    //           <div className='col-md-2 article-value'>{ article.value }</div>
    //           <div className='col-md-1 article-expand-wrapper'>
    //             <button
    //               className='btn btn-default article-expand-btn btn-xs'
    //               onClick={(e) => this.props.handleArticleChange(article.id, article.type)}
    //             >
    //               <i class={`fa fa-angle-${isCollapsed ? 'up' : 'down'}`}></i>
    //             </button>
    //           </div>
    //         </div>
    //       </div>

    //       { isCollapsed ?
    //         <div className='panel-body'>
    //           { this.createCounterpartiesList(counterparties) }
    //         </div>
    //       : null }

    //     </div>
    //   )
    // })
  }

  createCounterpartiesList(counterparties) {
    const { type } = this.props

    return counterparties.map((counterparty, index) => {
      return(
        <div className={`counterparty-wrapper type-${type}`} key={index}>
          <div className='row'>
            <div className='col-md-9 counterparty-name'>{ counterparty.name || '-' }</div>
            <div className='col-md-3 counterparty-value'>{ counterparty.value }</div>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className='reports-list-item'>
        { this.createArticlesList() }
      </div>
    )
  }
}
