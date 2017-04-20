import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { bindActionCreators }          from 'redux';
import { actions as workspaceActions } from '../../resources/workspace';
import FormInput                       from '../layout/form/input';
import extractPropertyFromObject       from '../../utils/extractPropertyFromObject';

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
    let workspaceValues = extractPropertyFromObject(this.state.workspace, 'value');
    let params = {}

    if (index) { params['index'] = index }

    if (workspace) {
      workspaceValues = Object.assign({}, workspace, workspaceValues);
    }

    this.props.handleSave(workspaceValues, params)
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

    return(
      <Formsy.Form 
        ref="form"
        onValidSubmit={this.handleSubmit} 
        onValid={this.toggleButton.bind(this, true)} 
        onInvalid={this.toggleButton.bind(this, false)}
        className="workspaceForm"
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
              <span>Create Workspace</span>
              <i class="fa fa-circle-o-notch fa-spin"></i>
            </span> 
            : editing ? 'Update' : 'Create Workspace'
          }
        </button>
      </Formsy.Form>
    );
  }
}
