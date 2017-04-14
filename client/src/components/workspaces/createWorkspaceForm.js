import React, { Component, PropTypes } from 'react';
import { connect }                     from 'react-redux';
import { bindActionCreators }          from 'redux';
import { actions as workspaceActions } from '../../resources/workspace';
import FormInput                       from '../layout/form/input';
import extractPropertyFromObject       from '../../utils/extractPropertyFromObject';

export default class CreateWorkspaceForm extends Component {
  constructor(props) {
    super(props);

    this.workspaceState = {
      title: {
        value: '',
        blured: false,
      }
    };

    this.state = {
      workspace: this.workspaceState,
      canSubmit: true
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {}

  handleSubmit = model => {
    const { workspace } = this.state;
    const workspaceValues = extractPropertyFromObject(workspace, 'value');

    this.props.handleSave(workspaceValues, function() {
      this.setState({
        workspace: this.workspaceState
      });

      this.resetForm();
    }.bind(this));
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
    const { fetching } = this.props;

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
          value={title.value}
          isBlured={title.blured}
          handleChange={this.handleChange}
          validationErrors={{
            isRequired: "Title is required"
          }}
          required
        />

        <button 
          type="submit" 
          className="btn btn-success"
          disabled={!this.state.canSubmit || fetching}
        >
          { fetching ?
            <span className="spin-wrap">
              <span>Create Workspace</span>
              <i class="fa fa-circle-o-notch fa-spin"></i>
            </span> 
            : 'Create Workspace'
          }
        </button>
      </Formsy.Form>
    );
  }
}
