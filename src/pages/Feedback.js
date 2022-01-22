import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from '../component/Header';
import './Feedback.css';

const assertionsNumber = 3;

export class Feedback extends Component {
  render() {
    const { assertions, score, history } = this.props;
    return (
      <div>
        <Header />
        <div className="container">
          <div className="subcontainer">
            <p className="feedback-text" data-testid="feedback-text">
              {assertions < assertionsNumber ? 'Could be better...' : 'Well Done!'}
            </p>
            { assertions < assertionsNumber ? <img src="https://media2.giphy.com/media/P53TSsopKicrm/giphy.gif?cid=790b7611669e76b4cb9e2f2c046dbb4aa4ccc5968da1d660&rid=giphy.gif&ct=g" alt="celebrate" /> : <img src="https://media1.giphy.com/media/IwAZ6dvvvaTtdI8SD5/giphy.gif?cid=790b7611e7266ed5cbeeaf4113843a7715de200d81b65b78&rid=giphy.gif&ct=g" alt="celebrate" /> }
          </div>
          <div className="main-feedback">
            <span>SCORE:</span>
            <p data-testid="feedback-total-score">{ score }</p>
            <span>ASSERTIONS:</span>
            <p data-testid="feedback-total-question">{ assertions }</p>
          </div>
          <div className="feedback-buttons-container">
            <button
              className="feedback-buttons"
              type="button"
              data-testid="btn-play-again"
              onClick={ () => {
                history.push('/');
              } }
            >
              Play again
            </button>
            <button
              className="feedback-buttons ranking-btn"
              type="button"
              data-testid="btn-ranking"
              onClick={ () => {
                history.push('/ranking');
              } }
            >
              Ranking
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  score: state.player.score,
  assertions: state.player.assertions,
  name: state.player.name,
  gravatarEmail: state.player.email,
});

Feedback.propTypes = {
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default connect(mapStateToProps)(Feedback);
