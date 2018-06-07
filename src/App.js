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
    this.state = {
      sortBy: 'hot'
    };
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  handleFilterChange(sortBy) {
    this.setState({sortBy: sortBy});
    this.refs.post.generatePosts('after', '', sortBy);
    this.refs.navigation.resetPageCounter();
  }

  handleForwardClick() {
    this.refs.post.generatePosts('after', this.refs.post.state.lastPostId, this.state.sortBy);
    scroll.scrollToTop({duration: 300});
  }

  handleBackwardClick() {
    this.refs.post.generatePosts('before', this.refs.post.state.firstPostId, this.state.sortBy);
    scroll.scrollToTop({duration: 300});
  }

  render() {
    return (
      <div className='page-container'>
        <Logo />
        <Filter handleFilterChange={this.handleFilterChange}/>
        <Animated animationIn='fadeIn' isVisible={true} className='animation-styles'>
          <Post ref='post' className='animation-props'/>
        </Animated>
        <Navigation ref='navigation' onForwardClick={this.handleForwardClick} onBackwardClick={this.handleBackwardClick}/>
      </div>
    );
  }
}

export default App;
