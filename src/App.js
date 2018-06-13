import React, { Component } from 'react';
import { Logo } from './components/main-page/logo';
import { Posts } from './components/main-page/posts';
import { Filter } from './components/main-page/filter';
import { Animated } from "react-animated-css";
import { Navigation } from './components/main-page/navigation';
import { animateScroll as scroll } from 'react-scroll';
import { subredditDefault } from './api/subreddit-api';
import './styles/main-page-styles.css';
import { SubredditInput } from './components/main-page/subreddit-input';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: 'hot',
      sortBy: '',
      subreddit: subredditDefault,
      atEnd: false
    };
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortByChange = this.handleSortByChange.bind(this);
    this.removeForwardArrows = this.removeForwardArrows.bind(this);
    this.handleSubredditChange = this.handleSubredditChange.bind(this);
  }

  handleFilterChange(filter) {
    if (filter !== this.state.filter) {
      this.setState({filter: filter});
      if (filter === 'top') {
        this.refs.post.generatePosts(this.state.subreddit, 'after', '', filter, 'hour');
      } else {
        this.refs.post.generatePosts(this.state.subreddit, 'after', '', filter, '');
      }
      this.refs.navigation.resetPageCounter();
    }
  }

  handleSortByChange(sortBy) {
    this.setState({sortBy: sortBy});
    this.refs.post.generatePosts(this.state.subreddit, 'after', '', this.state.filter, sortBy);
    this.refs.navigation.resetPageCounter();
  }

  handleForwardClick() {
    this.refs.post.generatePosts(this.state.subreddit, 'after', this.refs.post.state.lastPostId, this.state.filter, this.state.sortBy);
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  handleBackwardClick() {
    this.setState({atEnd: false});
    this.refs.post.generatePosts(this.state.subreddit, 'before', this.refs.post.state.firstPostId, this.state.filter, this.state.sortBy);
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  removeForwardArrows() {
    this.setState({atEnd: true});
  }

  handleSubredditChange(subreddit) {
    this.setState({subreddit: subreddit, atEnd: false})
    this.refs.post.generatePosts(subreddit, 'after', '', 'hot', '');
  }

  render() {
      return(
        <div className='page-container'>
          <Logo />
          <div className='options-container'>
            <Filter handleFilterChange={this.handleFilterChange} handleSortByChange={this.handleSortByChange}/>
            <SubredditInput handleSubredditChange={this.handleSubredditChange}/>
          </div>
          <Animated animationIn='fadeIn' isVisible={true} className='animation-styles'>
            <Posts ref='post' className='animation-props' removeForwardArrows={this.removeForwardArrows}/>
          </Animated>
          <Navigation 
            ref='navigation' 
            onForwardClick={this.handleForwardClick} 
            onBackwardClick={this.handleBackwardClick}
            atEnd={this.state.atEnd}/>
        </div>
      );
    }
}

export default App;
