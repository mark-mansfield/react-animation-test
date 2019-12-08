import React, { PureComponent } from 'react';
import { TimelineLite } from 'gsap/all';
import Timer from './components/Timer';

/**
 * * ScoreBoard
 * @desc Animate GraphicsUsing GSAP
 * @params {props} contains an array of objects with animation information
 * @objectToAnimtate { name_of_graphic , animation_delay }
 */

//  TODO refactor this using functional components, use context.
// ? is there a way to import the animations

class ScoreBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false
    };
    this.cardWidth = 80; // card width , a unit of measure for building the graphics
    this.scoreboardRef = null;
    this.scoreboardRef_homeTeam = null;
    this.homeTeamTextRef = null;
    this.awayTeamTextRef = null;
    this.scoreboardRef_scores = null;
    this.scoreboardRef_awayTeam = null;
    this.scoreTextRef = null;
    this.clockRef = null;
    this.teamStatRef = null;
    this.teamStatLeftColRef = null;
    this.teamStatRightColRef = null;
    this.scoreboardTimeline = new TimelineLite({ paused: true });
    this.clockTimeLine = new TimelineLite({ paused: true });
    this.teamStatTimeline = new TimelineLite({ paused: true });
  }

  componentDidMount() {
    // score board timeline
    this.scoreboardTimeline
      .from(this.scoreboardRef_scores, 0.5, {
        scaleX: 0,
        autoAlpha: 0,
        onStart: () => {
          console.log('starting animation');
          this.setState({ isAnimating: true });
        }
      })
      .from(this.scoreTextRef, 0.3, { autoAlpha: 0, scale: 2 })
      .from(this.scoreboardRef_homeTeam, 0.3, { autoAlpha: 0 })
      .to(this.scoreboardRef_homeTeam, 0.3, { left: -7 })
      .from(this.homeTeamTextRef, 0.3, { autoAlpha: 0, x: 20 })
      .from(this.scoreboardRef_awayTeam, 0.3, { autoAlpha: 0 }, '-=0.9')
      .to(this.scoreboardRef_awayTeam, 0.3, { left: this.cardWidth * 2 + 10 })
      .from(this.awayTeamTextRef, 0.3, {
        autoAlpha: 0,
        x: -20,
        onComplete: () => {
          this.setState({ isAnimating: false });
          if (this.props.animation.length !== 2) {
            this.clockTimeLine.play();
          }
        }
      });

    //  clock timeline
    this.clockTimeLine
      .from(this.clockRef, 0.5, {
        autoAlpha: 0,
        onStart: () => {
          this.setState({ isAnimating: true });
        }
      })
      .to(
        this.clockRef,
        1,
        {
          left: this.cardWidth * 3 + 17,
          onComplete: () => {
            this.setState({ isAnimating: false });
          }
        },
        '-=0.5'
      );

    // team stats time line
    this.teamStatTimeline
      .from(this.teamStatRef, 1, {
        autoAlpha: 0,
        onStart: () => {
          this.setState({ isAnimating: true });
        }
      })
      .to(this.teamStatRef, 1, { x: this.cardWidth * 3.22 }, '-=0.5')
      .to(this.teamStatRightColRef, 1, {
        x: this.cardWidth * 3 - 10,
        onComplete: () => {
          this.setState({ isAnimating: false });
        }
      });
  }

  /**
   * @param {props} { animation: GRAPHIC_NAME, delay: DELAY_TIME }
   * * this example always runs the animations in a certain sequence
   * * first sequence animates in the scoreboard
   * * second sequence animates in the clock
   * * third sequence animates in the team stats
   * * on every update to chose the correct logic
   * * by evaluating the length of previous props array  vs new props array
   * ? is there a better way to evaluate the props array
   */

  componentDidUpdate(prevProps, prevState) {
    //  if we are animating , pause before evaluating new props
    if (this.state.isAnimating) {
      console.log('PAUSING *******************');
      setTimeout(() => {
        console.log('PAUSING COMPLETE');
      }, 1500);
    }

    // play the scoreboard animation  will equal an evaluation of (0 : 1)
    // Scoreboard always displays first in the props object and is always the first   item in the object array
    if (!this.state.isAnimating) {
      if (prevProps.animation.length === 0 && this.props.animation.length === 1) {
        this.scoreboardTimeline.delay(this.props.animation[0].delay);
        this.scoreboardTimeline.play();
        console.log('play the scoreboard animation');
      }

      // reverse the clock animation
      // play the team stat animation  {1: implied : 2}
      if (this.props.animation.length === 2) {
        this.clockTimeLine.reverse();
        // this.teamStatTimeline.delay(this.props.animation[0].delay);
        this.teamStatTimeline.play().delay(this.props.animation[0].delay);
      }

      // reverse the team Stat and play the clock animation
      //  { 2 : 1}
      if (prevProps.animation.length === 2 && this.props.animation.length === 1) {
        this.teamStatTimeline.reverse(1.5);
        this.clockTimeLine.play().delay(1);
      }

      // reverse the scoreboard animation hide scoreboard
      if (prevProps.animation.length === 1 && this.props.animation.length === 0) {
        this.clockTimeLine.reverse(0.3);
        this.scoreboardTimeline.reverse(1).delay(1);
      }

      // when the teamstat component is in full view and the scoreboard is toggled out
      // reverse all animations
      if (prevProps.animation.length === 2 && this.props.animation.length === 0) {
        this.setState({ isAnimating: true });
        this.teamStatTimeline.reverse();
        this.clockTimeLine.reverse().delay(1);
        this.scoreboardTimeline.reverse().delay(2.5);
        setTimeout(() => {
          this.setState({ isAnimating: false });
        }, 2500);
      }
    }
  }

  render() {
    console.log(this.props.animation);
    return (
      <div className="overlay-bg">
        <div>
          <div className="scoreboard">
            <div className="d-flex" ref={div => (this.scoreboardRef = div)}>
              <div
                // effect slide left
                className="hometeam card"
                ref={div => (this.scoreboardRef_homeTeam = div)}
                style={{
                  backgroundColor: this.props.homeTeamColor,
                  textAlign: 'center'
                }}>
                <span ref={e => (this.homeTeamTextRef = e)}>GG</span>
              </div>

              <div
                className="scores card"
                // effect fade in and scaleX
                ref={div => (this.scoreboardRef_scores = div)}
                style={{
                  textAlign: 'center'
                }}>
                <span ref={e => (this.scoreTextRef = e)}>2:0</span>
              </div>

              <div
                className="awayteam card"
                // effect slide right
                ref={div => (this.scoreboardRef_awayTeam = div)}
                style={{
                  backgroundColor: this.props.awayTeamColor,
                  textAlign: 'center'
                }}>
                <span ref={e => (this.awayTeamTextRef = e)}>MU</span>
              </div>
              <div ref={div => (this.clockRef = div)} className="clock card">
                <Timer />
              </div>
              <div className="teamstat" ref={div => (this.teamStatRef = div)}>
                <div
                  ref={div => (this.teamStatLeftColRef = div)}
                  className="team-stat-left-col"
                  style={{
                    backgroundColor: this.props.homeTeamColor
                  }}>
                  <div className="team-logo">
                    <i className="fa fa-shield "></i>
                  </div>
                  <div className="team-name">Kingston City</div>
                </div>

                <div ref={div => (this.teamStatRightColRef = div)} className="team-stat-right-col team-red-cards">
                  <div>Red Cards</div>
                  <div>
                    <span className="large-text">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ScoreBoard;
