import React, { Component }                   from 'react';
import { connect }                            from 'react-redux';
import { bindActionCreators }                 from 'redux';
import { actions as workspaceActions }        from '../../resources/features';
import { actions as workspaceAppActions }     from '../../actions/workspaces';
import { toaster }                            from '../../actions/alerts';
import * as utils                             from '../../utils';
import                                             '../../styles/features/features.css';

@connect(
  state => ({
    currentFeatures: state.features
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...workspaceActions,
      ...workspaceAppActions,
      toaster
    }, dispatch)
  })
)
export default class Features extends Component {
  constructor(props) {
    super(props);
    this.toaster = props.actions.toaster();
    this.state = {
      title: null,
      sales: false
    };
  }

  handleChange() {
    let newState = this.state.sales;
    newState = !newState;
    this.setState({ sales: newState });
  }

  handleUpdate(element) {
    const { id } = this.props.routeParams;
    const { sales } = this.state;
    const { actions, dispatch } = this.props;

    element.preventDefault();

    return new Promise((resolve, reject) => {
      actions.updateFeatures({ id, sales })
        .then(res => {
          dispatch({ type: 'UPDATE_WORKSPACE_SETTINGS', payload: sales });

          this.toaster.success('Workspace settings has been updated');
          resolve(res);
        })
        .catch(err => {
          if (utils.debug) console.error(err);

          this.toaster.error('Could not update workspace settings!');
          reject(err);
        })
    })
  }

  componentWillMount() {
    const { title } = this.props.currentWorkspace;
    const { currentFeatures } = this.props

    this.setState({ title: title });

    if (currentFeatures && currentFeatures.sales) this.setState({ sales: currentFeatures.sales });
  }

  componentWillReceiveProps(newProps) {
    const { currentFeatures } = newProps
    if (currentFeatures && currentFeatures.sales) this.setState({ sales: currentFeatures.sales });
  }

  render() {
    if (this.props.routeParams.id == this.props.currentWorkspace.id) {
      return (
        <div className="container">
          <h3>{ this.state.title } workspace settings</h3>

          <form className='form-group' onSubmit={ this.handleUpdate.bind(this) }>
            <div className='col-xs-3'>
              <p>Enable sales</p>
            </div>

            <div className='col-xs-9 settings-switch pull-right'>
              <input
                type="checkbox"
                id="sales-switch"
                onChange={ this.handleChange.bind(this) }
                checked={ this.state.sales }
              />
              <label for="sales-switch" class="label-primary"></label>
            </div>

            <div className='col-xs-12'>
              <button className="btn btn-primary pull-left" type="submit">Update</button>
            </div>
          </form>
        </div>
      );
    } else {
      return (
        <div>
          <p>Only the current workspace can be configured</p>
        </div>
      );
    }
  }
}
