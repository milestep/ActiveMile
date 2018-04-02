import React, { Component, PropTypes }      from 'react';
import { connect }                          from 'react-redux';

@connect(
  state => ({
    inventory: state.inventory.items
  })
)
export default class InventoryItem extends Component {
  static propTypes = {
    inventory: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tbody>
        {
          this.props.inventory.map((item, index) => {
            return (
              <tr key={ index }>
                <td>{ item.name }</td>
                <td>{ item.date }</td>
              </tr>
            );
          })
        }
      </tbody>
    );
  }
}
