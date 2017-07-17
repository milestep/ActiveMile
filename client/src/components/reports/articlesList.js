import React, { Component, PropTypes }    from 'react';
import { bindActionCreators }             from 'redux';
import { connect }                        from 'react-redux';
import * as utils                         from '../../utils';

export default class TestArticlesList extends Component {
  static propTypes = {
    modelRegister: PropTypes.string.isRequired,
    currentRegisters: PropTypes.array.isRequired,
    handleArticleChange: PropTypes.func.isRequired
  };

  counterpartyList(article_id) {
    let counterparties = []

    for (var i = this.props.currentRegisters.length - 1; i >= 0; i--) {
      if (this.props.currentRegisters[i].article_id === article_id) {
        counterparties = this.props.currentRegisters[i].counterparty
        break
      }
    }

    return counterparties.map((counterparty, j) => {
      return (
        <div key={j}>
          <div className="row">
            <div className="col-md-4">{ counterparty.counterparty_name }: </div>
            <div className="col-md-8">{ counterparty.value }</div>
          </div>
        </div>
      );
    });
  }

  total() {
    let res_suma = 0
    let register = this.props.currentRegisters

    for (var i = register.length - 1; i >= 0; i--) {
      res_suma += register[i].suma_value
    }

    return res_suma
  }

  articlesList() {
    const { currentArticleId, handleArticleChange } = this.props;

    return this.props.currentRegisters.map((register, j) => {
      const isExpanded = currentArticleId == register.article_id;

      return (
        <div key={j}>
          <div class="panel panel-default">
            <div class="panel-heading">
              <div className="row">
                <div className="col-md-4">{ register.article_title }: </div>
                <div className="col-md-7">{ register.suma_value }</div>
                <div className="col-md-1">
                  <button
                    className="btn btn-default article-expand btn-xs"
                    onClick={(e) => handleArticleChange(register.article_id)(e)}
                  >
                    <i class={`fa fa-angle-${isExpanded ? 'up' : 'down'}`}></i>
                  </button>
                </div>
              </div>
            </div>

            <div class={ isExpanded ? 'panel-body' : '' }>
              { isExpanded ? this.counterpartyList(register.article_id) : '' }
            </div>
          </div>
        </div>
      );
    });
  }

  articlesListEmpty() {
    return (
      <div className="alert alert-info">
        <span>There are no articles here</span>
      </div>
    );
  }

  render() {
    return(
      <div>
        <div className="row">
          <div className="col-md-4"><h3>{ this.props.modelRegister }:</h3></div>
          <div className="col-md-8">
            <h3 className={this.props.modelRegister === 'Cost' ? 'color-red' : 'color-green'}>
              { this.total() }
            </h3>
          </div>
        </div>

        { this.props.currentRegisters.length > 0 ? this.articlesList() : this.articlesListEmpty() }
      </div>
    );
  }
}
