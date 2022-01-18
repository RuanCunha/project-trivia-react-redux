import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../component/Header';
import Question from '../component/Question';
import { fetchAPI, fetchToken } from '../services/servicesFetchAPI';
import play from '../images/play.png';

class Play extends Component {
  constructor() {
    super();

    this.state = {
      questions: [],
      render: false,
      actualQuestion: 0,
    };

    this.getReponseAPI = this.getReponseAPI.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.changeDisplayHidden = this.changeDisplayHidden.bind(this);
  }

  componentDidMount() {
    this.getReponseAPI();
  }

  // Lógica grupo Gabriel Fontes:
  // validar se o token está válido:
  async getReponseAPI() {
    const { token } = this.props;
    const questions = await fetchAPI(token);
    if (questions.response_code === 0) {
      this.setState({ questions, render: true });
    } else {
      const newToken = await fetchToken();
      const newQuestions = await fetchAPI(newToken);
      this.setState({ questions: newQuestions, render: true });
    }
  }

  nextQuestion() {
    const { history } = this.props;
    const { actualQuestion, questions } = this.state;
    if (actualQuestion === questions.length - 1) {
      history.push('/feedback');
    } else {
      this.setState({
        actualQuestion: actualQuestion + 1,
      });
    }
    this.changeDisplayHidden();
  }

  changeDisplayHidden() {
    const nextButton = document.querySelector('.next-button');
    nextButton.style.visibility = 'hidden';
  }

  render() {
    const { questions, actualQuestion, render } = this.state;
    console.log(questions);
    return (
      <div>
        <h1>Página do Play</h1>
        <Header />
        <Link to="/feedback">Feedback</Link>
        { render && <Question
          nextQuestion={ this.nextQuestion }
          question={ questions[actualQuestion] }
        /> }
        <div>
          <img className="play-img" src={ play } alt="" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  token: state.token,
});

Play.propTypes = {
  token: PropTypes.string.isRequired,
  history: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Play);
