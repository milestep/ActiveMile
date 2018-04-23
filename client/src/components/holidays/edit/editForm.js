import React, { Component }                 from 'react';
import moment                               from 'moment';
import { bindActionCreators }               from 'redux';
import { connect }                          from 'react-redux';
import { Link }                             from 'react-router';
import { push }                             from 'react-router-redux';
import FormDatePicker                       from '../../layout/form/datePicker';
import { toaster }                          from '../../../actions/alerts';
import * as utils                           from '../../../utils';
import { update as updateHolidaysItem,
         show   as fetchHolidaysItem }      from '../../../actions/holidays';

@connect(
  state => ({
    holidays: state.holidays.items,
    holidaysItem: state.holidays.item
  }),
  dispatch => ({
    actions: bindActionCreators({
      updateHolidaysItem,
      fetchHolidaysItem,
      toaster
    }, dispatch)
  })
)
export default class HolidaysEditForm extends Component {
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
    const { actions, params, dispatch } = this.props;
    const { id } = params;
    let { item } = this.state;

    item.date.add(1, 'days')

    return new Promise((resolve, reject) => {
      actions.updateHolidaysItem(item, id)
        .then(res => {
          dispatch(push('/holidays'));
          this.toaster.success('Holiday has been updated');
          resolve(res);
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          this.toaster.error('Only logged in user could update an holiday!');
          reject(err)
        })
    })
  }

  componentDidMount() {
    this.fetchHolidaysItem();
  }

  fetchHolidaysItem() {
    const { actions, params } = this.props;
    const { id } = params;

    actions.fetchHolidaysItem(id);
  }

  componentWillReceiveProps(newProps) {
    const { holidaysItem } = newProps;
    const { item } = this.state;

    if ( holidaysItem.date != item.date ) {
      this.setState({
        item: {
          name: holidaysItem.name,
          date: moment(holidaysItem.date)
        }
      });
    }
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
              required
            />
          </div>

          <div className="form-group">
            <label for="date">Date:</label>
            <FormDatePicker
              handleChange={ this.handleChange.bind(this) }
              selected={ this.state.item.date }
              name="date"
              id="date"
              required
            />
          </div>

          <div className="btn-group pull-right">
            <button
              type="submit"
              className="btn btn-sm btn-danger"
            >Update</button>

            <div className="btn btn-sm btn-primary">
              <Link to='/holidays'>
                <span className='edited-button'>Cancel</span>
              </Link>
            </div>
          </div>
        </Formsy.Form>
      </div>
    );
  }
}
