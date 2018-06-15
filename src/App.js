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
      atEnd: false,
    };
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortByChange = this.handleSortByChange.bind(this);
    this.removeForwardArrows = this.removeForwardArrows.bind(this);
    this.handleSubredditChange = this.handleSubredditChange.bind(this);
    this.backwardsPageIds = {};
  }

  handleFilterChange(filter) {
    this.setState({atEnd: false});
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
  handleForwardClick(pageCount) {
    // backwardsPageIds is used to store the last post ID of each page when navigating forward
    // This is then referenced in handleBackwardClick() in order to know which post to load after
    this.backwardsPageIds[pageCount + 1] = this.refs.post.state.lastPostId;
    this.refs.post.generatePosts(this.state.subreddit, 'after', this.refs.post.state.lastPostId, this.state.filter, this.state.sortBy);
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  handleBackwardClick(pageCount) {
    if (this.state.atEnd === true) { this.setState({atEnd: false}) }
    if (pageCount === 2) {
      this.refs.post.generatePosts(this.state.subreddit, 'after', '', this.state.filter, this.state.sortBy);
    } else {
      this.refs.post.generatePosts(this.state.subreddit, 'after', this.backwardsPageIds[pageCount - 1], this.state.filter, this.state.sortBy);
    }
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  removeForwardArrows() {
    this.setState({atEnd: true});
  }

  handleSubredditChange(subreddit) {
    this.setState({subreddit: subreddit, atEnd: false, filter: 'hot'})
    this.refs.post.generatePosts(subreddit, 'after', '', 'hot', '');
    this.refs.navigation.resetPageCounter();
    this.refs.filter.resetFilter();
  }

  render() {
      return(
        <div className='page-container'>
          <Logo />
          <div className='options-container'>
            <Filter ref='filter' handleFilterChange={this.handleFilterChange} handleSortByChange={this.handleSortByChange}/>
            <SubredditInput handleSubredditChange={this.handleSubredditChange} subreddit={this.state.subreddit}/>
          </div>
          <Animated animationIn='fadeIn' isVisible={true} className='animation-styles'>
            <Posts 
              ref='post' 
              className='animation-props' 
              removeForwardArrows={this.removeForwardArrows}
              subreddit={this.state.subreddit}
              handleSubredditChange={this.handleSubredditChange}/>
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
