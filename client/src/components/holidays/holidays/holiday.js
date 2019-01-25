import React, { Component, PropTypes }      from 'react';
import moment                               from 'moment';
import { connect }                          from 'react-redux';
import { Link }                             from 'react-router';
import { bindActionCreators }               from 'redux';
import { destroy as destroyHolidayItem }    from '../../../actions/holidays';
import { toaster }                          from '../../../actions/alerts';
import * as utils                           from '../../../utils';
import cookie                               from "react-cookie";

@connect(
  state => ({
    holidays: state.holidays.items
  }),
  dispatch => ({
    actions: bindActionCreators({
      destroyHolidayItem,
      toaster
    }, dispatch)
  })
)
export default class HolidayItem extends Component {
  static propTypes = {
    holidays: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { edit: null }
    this.toaster = props.actions.toaster();
  }

  handleDestroy(id) {
    const { actions } = this.props;

    if (confirm("Are you sure?")) {
      return new Promise((resolve, reject) => {
        actions.destroyHolidayItem(id)
          .then(res => {
            this.toaster.success('Holiday has been deleted')
            resolve(res)
          })
          .catch(err => {
            if (utils.debug) console.error(err)
            this.toaster.error('Only logged in user could delete an Holiday!')
            reject(err)
          })
      })
    }
  }

  render() {
    return (
      <tbody>
        { this.props.holidays.map((item, index) => {
          return (
            <tr className = 'holiday-butns-hidden'  key={ index }>

              <td className='col-xs-5'>{ item.name }</td>

              <td className='col-xs-4'>{ moment(item.date).format("DD-MM-YYYY") }</td>

              <td>
                {cookie.load('token') ?
                  <div className="btn-group btns-hidden pull-right">
                    <Link
                      to={`/holidays/${item.id}/edit`}
                      className="btn btn-primary btn-sm"
                    >
                      <i className="glyphicon glyphicon-pencil"></i>
                    </Link>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={this.handleDestroy.bind(this, item.id)}
                    >
                      <i class="fa fa-times" aria-hidden="true"></i>
                    </button>
                  </div>
                : false}
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }
}
