import React, { Component, PropTypes }      from 'react';
import moment                               from 'moment';
import { connect }                          from 'react-redux';
import { Link }                             from 'react-router';
import { bindActionCreators }               from 'redux';
import { destroy as destroyInventoryItem }  from '../../actions/inventory';

@connect(
  state => ({
    inventory: state.inventory.items
  }),
  dispatch => ({
    actions: bindActionCreators({
      destroyInventoryItem
    }, dispatch)
  })
)
export default class InventoryItem extends Component {
  static propTypes = {
    inventory: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      edit: null
    }
  }

  handleDestroy(id) {
    const {actions} = this.props;
    actions.destroyInventoryItem(id);
  }

  render() {
    return (
      <tbody>
        { this.props.inventory.map((item, index) => {
          return (
            <tr key={ index }>
              <td className='col-xs-1'>{ index + 1 }</td>

              <td className='col-xs-5'>{ item.name }</td>

              <td className='col-xs-4'>{ moment(item.date).format("DD-MM-YYYY") }</td>

              <td>
                <div className="btn-group pull-right" >
                  <Link
                    to={`/inventory/${item.id}/edit`}
                    className="btn btn-primary btn-sm"
                  >
                    <i className="glyphicon glyphicon-pencil"></i>
                  </Link>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={ this.handleDestroy.bind(this, item.id) }
                  >
                    <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  }
}

