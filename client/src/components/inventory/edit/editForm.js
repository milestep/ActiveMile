import React, { Component }                 from 'react';
import moment                               from 'moment';
import { bindActionCreators }               from 'redux';
import { connect }                          from 'react-redux';
import { Link }                             from 'react-router';
import { push }                             from 'react-router-redux';
import FormDatePicker                       from '../../layout/form/datePicker';
import { update as updateInventoryItem }    from '../../../actions/inventory';
import { show as fetchInventoryItem }       from '../../../actions/inventory';
import { toaster }                          from '../../../actions/alerts';
import * as utils                           from '../../../utils';
import                                           '../../../styles/inventory/buttons.css'

@connect(
  state => ({
    inventory: state.inventory.items,
    inventoryItem: state.inventory.item
  }),
  dispatch => ({
    actions: bindActionCreators({
      updateInventoryItem,
      fetchInventoryItem,
      toaster
    }, dispatch)
  })
)
export default class InventoryEditorsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: {
        name: '',
        date: moment()
      }
    };

    this.toaster = props.actions.toaster();
  }

  handleSubmit() {
    const { item } = this.state;
    const { actions, params, dispatch } = this.props;
    const { id } = params;

    return new Promise((resolve, reject) => {
      actions.updateInventoryItem(item, id)
        .then(res => {
          dispatch(push('/inventory'));
          this.toaster.success('Item has been successfully updated');
          resolve(res);
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          this.toaster.error('Could not update an item!');
          reject(err)
        })
    })
  }

  componentDidMount() {
    this.fetchInventoryItem();
  }

  fetchInventoryItem() {
    const { actions, params } = this.props;
    const { id } = params;

    actions.fetchInventoryItem(id);
  }

  componentWillReceiveProps(newProps) {
    const { inventoryItem } = newProps;
    const { item } = this.state;

    if ( inventoryItem.date != item.date ) {
      this.setState({
        item: {
          name: inventoryItem.name,
          date: moment(inventoryItem.date)
        }
      });
    }
  }

  handleChange(field, element) {
    console.log('el', element.value);

    if (field == 'date') {
      if (element.value) {
        this.setState((prevState) => ({
          item: {
            ...prevState.item,
            date: element.value
          }
        }));
      }

    } else {
      let input = element.target.value;

      this.setState((prevState) => ({
        item: {
          ...prevState.item,
          [field]: input
        }
      }));
    }
  }

  render() {
    return (
      <div className='col-sm-4'>
        <Formsy.Form onSubmit={ this.handleSubmit.bind(this) }>
          <div className="form-group">
            <label for="name">Name:</label>
            <input
              onChange={ this.handleChange.bind(this, 'name') }
              value={ this.state.item.name }
              className="form-control"
              name="name"
              id="name"
            />
          </div>

          <div className="form-group">
            <label for="date">Date:</label>
            <FormDatePicker
              handleChange={ this.handleChange.bind(this) }
              selected={ this.state.item.date }
              name="date"
              id="date"
            />
          </div>

          <div className="btn-group pull-right">
            <button
              type="submit"
              className="btn btn-sm btn-danger"
            >Update</button>

            <div className="btn btn-sm btn-primary">
              <Link to='/inventory'>
                <span className='edited-button'>Cancel</span>
              </Link>
            </div>
          </div>
        </Formsy.Form>
      </div>
    );
  }
}
