import React, { Component }                 from 'react';
import moment                               from 'moment';
import { bindActionCreators }               from 'redux';
import { connect }                          from 'react-redux';
import FormDatePicker                       from '../layout/form/datePicker';
import { update as updateInventoryItem }    from '../../actions/inventory';
import { show as fetchInventoryItem }       from '../../actions/inventory';

@connect(
  state => ({
    inventory: state.inventory.items,
    inventoryItem: state.inventory.item
  }),
  dispatch => ({
    actions: bindActionCreators({
      updateInventoryItem,
      fetchInventoryItem
    }, dispatch)
  })
)
export default class InventoryEditorsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item: {
        name: null,
        date: moment()
      }
    };
  }

  handleSubmit() {
    const { item } = this.state;
    const { actions } = this.props;

    actions.updateInventoryItem(item);
  }

  handleChange(field, element) {
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

  componentDidMount() {
    this.fetchInventoryItem();
  }

  componentWillReceiveProps(newProps) {
    const { inventoryItem } = newProps;
    const { name, date } = inventoryItem;

    this.setState({
      item: {
        name: name,
        date: date
      }
    });
  }

  fetchInventoryItem() {
    const { actions, params } = this.props;
    const { id } = params;

    actions.fetchInventoryItem(id);
  }

  render() {
    const { name, date } = this.state.item;

    console.log('name:', name, 'date', date)

    return (
      <div className='col-sm-4'>
        <Formsy.Form onSubmit={ this.handleSubmit.bind(this) }>
          <div className="form-group">
            <label for="name">Name:</label>
            <input
              onChange={ this.handleChange.bind(this, 'name') }
              className="form-control"
              defaultValue={ name }
              id="name"
              required
            />
          </div>

          <div className="form-group">
            <label for="date">Date:</label>
            <FormDatePicker
              handleChange={ this.handleChange.bind(this) }
              selected={ moment() }
              name="date"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
          >Update</button>
        </Formsy.Form>
      </div>
    );
  }
}
