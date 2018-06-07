import React, { Component } from 'react';
import { Post } from './components/post';
import { Logo } from './components/logo';
import { Animated } from "react-animated-css";
import { Navigation } from './components/navigation';
import { animateScroll as scroll } from 'react-scroll';
import './styles/styles.css';
import { Filter } from './components/filter';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
  }

  handleForwardClick() {
    this.refs.post.generatePosts('after', this.refs.post.state.lastPostId);
    scroll.scrollToTop({duration: 300});
  }

  handleBackwardClick() {
    this.refs.post.generatePosts('before', this.refs.post.state.firstPostId);
    scroll.scrollToTop({duration: 300});
  }

  render() {
    return (
      <div className='page-container'>
        <Logo />
        <Filter />
        <Animated animationIn='fadeIn' isVisible={true} className='animation-styles'>
          <Post ref='post' className='animation-props'/>
        </Animated>
        <Navigation onForwardClick={this.handleForwardClick} onBackwardClick={this.handleBackwardClick}/>
      </div>
    );
  }
}

export default App;
