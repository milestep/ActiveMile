import React, { PropTypes, Component } from 'react';
import { connect }                     from 'react-redux';
import { login }                       from '../../actions/auth';
import FormInput                       from '../layout/form/input';
import * as utils                      from '../../utils';

@connect(state => ({
  fetching: state.auth.fetching.signin,
  fetched: state.auth.fetched.signin
}), { login })
export default class Login extends Component {
  static propTypes = {
    fetching: PropTypes.bool.isRequired,
    fetched: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    
    this.userState = {
      email: {
        value: '',
        blured: false
      },
      password: {
        value: '',
        blured: false
      }
    }

    this.state = {
      user: this.userState,
      canSubmit: true
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (field, values) => {
    this.setState((prevState) => ({
      user: {
        ...prevState.user,
        [field]: {
          ...prevState.user[field],
          ...values
        }
      }
    }));
  }

  handleSubmit = model => {
    const { user } = this.state;
    const router = this.context.router;
    const userValues = utils.extractPropertyFromObject(user, 'value');

    this.props.login(userValues, router);
  }

  toggleButton = status => {
    this.setState({
      canSubmit: status
    });
  }

  resetForm() {
    this.refs.form.reset();
  }

  render() {
    const { email, password } = this.state.user;
    const { fetching, fetched } = this.props;

    return(
      <div className="row">
        <div className="col-md-6 col-md-offset-3">

          <h3>Login</h3>

          <Formsy.Form 
            ref='form'
            onValidSubmit={this.handleSubmit} 
            onValid={this.toggleButton.bind(this, true)} 
            onInvalid={this.toggleButton.bind(this, false)}
          >

            <FormInput 
              title="Email"
              name="email"
              type="email"
              value={email.value}
              isBlured={email.blured}
              validations="isEmail"
              validationErrors={{
                isEmail: "Email is not valid",
                isRequired: "Email is required"
              }}
              handleChange={this.handleChange}
              required
            />

            <FormInput 
              title="Password"
              name="password"
              type="password"
              value={password.value}
              isBlured={password.blured}
              validations="minLength:6"
              validationErrors={{
                minLength: "Minimum password length is 6",
                isRequired: "Password is required"
              }}
              handleChange={this.handleChange}
              required
            />

            <button 
              type="submit" 
              className="btn btn-success"
              disabled={!this.state.canSubmit || fetching}
            >
              { fetching ?
                <span className="spin-wrap">
                  <span>Sign in</span>
                  <i class="fa fa-circle-o-notch fa-spin"></i>
                </span> 
                : 'Sign in'
              }
            </button>
            
          </Formsy.Form>

        </div>
      </div>
    );
  };
}
