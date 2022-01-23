import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { responseTokenAPI, loginAction } from '../redux/action';
import { setLocalStorage } from '../services/localStorage';
import { fetchToken } from '../services/servicesFetchAPI';
import './Login.css';
import blackCatLogo from '../images/Black-cat-asks-logo.png';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
      isDisabled: 'true',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.validateInput = this.validateInput.bind(this);
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, this.validateInput);
  }

  validateInput() {
    const { email, name } = this.state;
    // Regex Valida E-mail: https://pt.stackoverflow.com/questions/1386/express%C3%A3o-regular-para-valida%C3%A7%C3%A3o-de-e-mail
    const regexValidateEmail = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.?$/i;
    const emailValidate = regexValidateEmail.test(String(email).toLowerCase());
    return (emailValidate && name.length !== 0)
      ? this.setState({ isDisabled: false })
      : this.setState({ isDisabled: true });
  }

  async handleClick() {
    const { history, token, login } = this.props;
    const tokenValidate = await fetchToken();
    login(this.state);
    token(tokenValidate);
    setLocalStorage('token', tokenValidate);
    history.push('/play');
  }

  render() {
    const { name, email, isDisabled } = this.state;
    const { history } = this.props;
    return (
      <div className="main-login">
        <form className="form">
          <div><img width="300px" src={ blackCatLogo } alt="logo" /></div>
          <label htmlFor="name">
            Nome:
            <input
              // autoComplete="off"
              type="text"
              data-testid="input-player-name"
              placeholder="Nome"
              name="name"
              id="name"
              value={ name }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="email">
            Email:
            <input
              // autoComplete="off"
              type="text"
              data-testid="input-gravatar-email"
              placeholder="example@email.com"
              name="email"
              id="email"
              value={ email }
              onChange={ this.handleChange }
            />
          </label>
          <button
            className="btn-play"
            type="button"
            data-testid="btn-play"
            onClick={ this.handleClick }
            disabled={ isDisabled }
          >
            Play
          </button>
          <button
            className="btn-settings"
            type="button"
            data-testid="btn-settings"
            onClick={ () => history.push('/settings') }
          >
            Settings
          </button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: (payload) => dispatch(loginAction(payload)),
  token: (payload) => dispatch(responseTokenAPI(payload)),
});

Login.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  login: PropTypes.func.isRequired,
  token: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
