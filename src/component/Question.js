import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { pointsPlayer, assertionsPlayer } from '../redux/action';
import './Question.css';

const milliseconds = 1000;
const correctAnswer = 'correct-answer';
const numeroTres = 3;
const numeroDez = 10;

export class Question extends Component {
  constructor() {
    super();
    this.state = {
      alternatives: [],
      seconds: 30,
      clicked: false,
      disabledButton: false,
      assertions: 0,
      // score: 0,
    };
    this.alternativesQuestions = this.alternativesQuestions.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.regressTimer = this.regressTimer.bind(this);
    this.stopTime = this.stopTime.bind(this);
    this.assertionQuestions = this.assertionQuestions.bind(this);
    this.levelQuestion = this.levelQuestion.bind(this);
    this.questionScore = this.questionScore.bind(this);
    this.changeDisplayVisible = this.changeDisplayVisible.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
  }

  componentDidMount() {
    this.alternativesQuestions();
    this.regressTimer();
  }

  // Lógica grupo Gabriel Fontes
  componentDidUpdate(prevProps) {
    const { question } = this.props;
    if (prevProps.question !== question) {
      this.alternativesQuestions();
    }
  }

  // Lógica para o cronometro para responder as perguntas:
  regressTimer() {
    const interval = setInterval(() => {
      const { seconds, clicked } = this.state;
      if (seconds === 1 || clicked === true) {
        this.setState({
          disabledButton: true,
        });
        return clearInterval(interval);
      }
      this.setState({
        seconds: seconds - 1,
      });
    }, milliseconds);
  }

  // Lógica grupo Gabriel Fontes sobre respostas na aplicação
  // Lógica para gerar randomicamente as respostas
  alternativesQuestions() {
    const { question } = this.props;
    // console.log(question);
    if (Object.keys(question).length > 0) {
      const answers = question.incorrect_answers
        .map((incorrect, index) => [incorrect, `wrong-answer-${index}`,
          Math.floor(Math.random() * (100 - 1)) + 1]);
      const results = [...answers, [question.correct_answer, correctAnswer,
        Math.floor(Math.random() * (100 - 1)) + 1]];
      const alternatives = results.sort((a, b) => a[2] - b[2]);
      this.setState({ alternatives });
    }
  }

  // Lógica para mudar a cor da resposta:
  changeColor() {
    const button = document.querySelectorAll('.answers');
    button.forEach((alternatives) => {
      alternatives.classList
        .toggle(alternatives.name === correctAnswer ? 'correct' : 'incorrect');
    });
  }

  // Lógica para score do game, pontuação:
  levelQuestion() {
    const { question } = this.props;
    // console.log(question);
    if (question.difficulty === 'medium') {
      return 2;
    }
    if (question.difficulty === 'hard') {
      return numeroTres;
    }
    return 1;
  }

  questionScore() {
    const { seconds } = this.state;
    const { points } = this.props;
    const levelQuestionReturn = this.levelQuestion();
    const calculatePoints = numeroDez + (levelQuestionReturn * seconds);
    points(calculatePoints);
  }

  stopTime() {
    this.setState({
      clicked: true,
    });
  }

  assertionQuestions() {
    const { assertions } = this.state;
    const { assert } = this.props;
    this.setState({ assertions: assertions + 1 });
    assert(assertions);
  }

  handleClick({ target }) {
    this.changeColor();
    this.stopTime();
    if (target.name === correctAnswer) {
      this.questionScore();
      this.assertionQuestions();
    }
    this.changeDisplayVisible();
  }

  changeDisplayVisible() {
    const nextButton = document.querySelector('.next-button');
    nextButton.style.visibility = 'visible';
  }

  handleNextClick() {
    const { nextQuestion } = this.props;
    nextQuestion();
    this.setState({
      alternatives: [],
      seconds: 30,
      clicked: false,
      disabledButton: false,
    });
    this.regressTimer();
  }

  render() {
    const { question } = this.props;
    const { alternatives, disabledButton, seconds } = this.state;
    return (
      <div>
        <div className="container-question">
          <p data-testid="question-category">{question.category}</p>
          <p data-testid="question-text">{question.question}</p>
        </div>
        <div data-testid="answer-options" className="container-answer">
          {
            alternatives.map(([text, testid], index) => (
              <button
                className="answers"
                type="button"
                key={ index }
                name={ testid }
                data-testid={ testid }
                disabled={ disabledButton }
                onClick={ this.handleClick }
                id={ testid }
              >
                {text}
              </button>
            ))
          }
        </div>
        { seconds }
        <button
          className="next-button"
          type="button"
          data-testid="btn-next"
          onClick={ this.handleNextClick }
        >
          Next
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  points: (payload) => dispatch(pointsPlayer(payload)),
  assert: (payload) => dispatch(assertionsPlayer(payload)),
});

Question.propTypes = {
  question: PropTypes.string.isRequired,
  points: PropTypes.func.isRequired,
  assert: PropTypes.func.isRequired,
  nextQuestion: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Question);
