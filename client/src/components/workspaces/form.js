import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { bindActionCreators }          from 'redux';
import { actions as workspaceActions } from '../../resources/workspaces';
import FormInput                       from '../layout/form/input';
import * as utils                      from '../../utils';

export default class WorkspaceForm extends Component {
  constructor(props) {
    super(props);

    const { workspace } = props;

    this.workspaceState = {
      title: {
        value: (workspace && workspace.title) ? workspace.title : '',
        blured: false,
      }
    };

    this.state = {
      workspace: this.workspaceState,
      canSubmit: true
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit = model => {
    const { workspace, index } = this.props;
    let workspaceValues = utils.extractPropertyFromObject(this.state.workspace, 'value');
    let params = {}

    if (index) { params['index'] = index }

    if (workspace) {
      workspaceValues = Object.assign({}, workspace, workspaceValues);
    }

    this.props.handleSubmit(workspaceValues, params)
      .then(res => {
        if (this.refs.form) {
          this.setState({
            workspace: this.workspaceState
          });

          this.resetForm();
        }
      });
  }

  handleChange = (field, values) => {
    this.setState((prevState) => ({
      workspace: {
        ...prevState.workspace,
        [field]: {
          ...prevState.workspace[field],
          ...values
        }
      }
    }));
  }

  toggleButton = (status) => {
    this.setState({
      canSubmit: status
    });
  }

  resetForm() {
    this.refs.form.reset();
  }

  render() {
    const { title } = this.state.workspace;
    const { fetching, editing } = this.props;
    const buttonCaption = editing ? 'Update' : 'Create Workspace';

    return(
      <Formsy.Form
        ref="form"
        onValidSubmit={this.handleSubmit}
        onValid={this.toggleButton.bind(this, true)}
        onInvalid={this.toggleButton.bind(this, false)}
        className="site-form workspaces-form"
      >
        <FormInput
          title="Title"
          name="title"
          label={editing ? false : true}
          value={title.value}
          inputClassName={editing ? "input-sm" : false}
          isBlured={title.blured}
          handleChange={this.handleChange}
          validationErrors={editing ? false : {
            isRequired: "Title is required"
          }}
          required
        />

        <button
          type="submit"
          className={`btn btn-success${editing ? ' btn-sm' : ''}`}
          disabled={!this.state.canSubmit || fetching}
        >
          { fetching ?
            <span className="spin-wrap">
              <span>{buttonCaption}</span>
              <i class="fa fa-circle-o-notch fa-spin"></i>
            </span>
            : buttonCaption
          }
        </button>
      </Formsy.Form>
    );
  }
}
