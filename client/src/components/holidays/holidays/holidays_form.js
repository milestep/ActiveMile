import React, { Component }                 from 'react';
import moment                               from 'moment';
import { bindActionCreators }               from 'redux';
import { connect }                          from 'react-redux';
import FormDatePicker                       from '../../layout/form/datePicker';
import { create  as createHolidayItem }     from '../../../actions/holidays';
import { toaster }                          from '../../../actions/alerts';
import * as utils                           from '../../../utils';

@connect(
  state => ({}),
  dispatch => ({
    actions: bindActionCreators({
      createHolidayItem,
      toaster
    }, dispatch)
  })
)
export default class HolidayForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: {
        name: null,
        date: moment()
      }
    };

    this.toaster = props.actions.toaster();
  }

  handleSubmit() {
    const { item } = this.state;
    const { actions } = this.props;

    return new Promise((resolve, reject) => {
      actions.createHolidayItem(item)
        .then(res => {
          this.toaster.success('Holiday has been created');
          resolve(res);
        })
        .catch(err => {
          if (utils.debug) console.error(err);
          this.toaster.error('Only logged in user could create an Holiday!');
          reject(err)
        })
    })
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
              className="form-control"
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
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
          >Submit</button>
        </Formsy.Form>
      </div>
    );
  }
}
