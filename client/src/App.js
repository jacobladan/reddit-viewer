import React, { Component } from 'react';
import { Posts } from './components/main-page/posts';
import { Filter } from './components/main-page/filter';
import { Animated } from "react-animated-css";
import { Navigation } from './components/main-page/navigation';
import { animateScroll as scroll } from 'react-scroll';
import { SubredditInput } from './components/main-page/subreddit-input';
import './styles/main-page-styles.css';
// import './server';
// comment
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      atEnd: false,
      currentListing: {
        subreddit: 'heroesofthestorm',
        id: '',
        filter: '',
        sortBy: 'hour',
        timestamp: ''
      }
    };

    // Used to update GUI for next generatePosts when using popstate
    this.nextListing = {
      subreddit: '',
      filter: '',
      sortBy: '',
      timestamp: '',
    }
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortByChange = this.handleSortByChange.bind(this);
    this.removeForwardArrows = this.removeForwardArrows.bind(this);
    this.handleSubredditChange = this.handleSubredditChange.bind(this);
    this.setHistory = this.setHistory.bind(this);
  }

  componentDidMount() {
    window.onpopstate = this.handlePopState.bind(this);
  }

  setHistory(subreddit, firstId, lastId, filter, sortBy) {
    let url = subreddit + '+' + filter + '+' + sortBy;
    let timestamp = Date.now();
    this.setState({
      currentListing: {
        subreddit: subreddit,
        filter: filter,
        sortBy: sortBy,
        timestamp: timestamp
      }
    });
    let data = {
        subreddit: subreddit,
        firstId: firstId,
        lastId: lastId,
        filter: filter,
        sortBy: sortBy,
        timestamp: timestamp
    };
    window.history.pushState(data, null, url);
  }

  // TODO: Add forward and backward check. When navigating forward, filter shouldn't keep previous'
  // Add timestamp to pushState data object. Compare it when popStating to one set in app State
  handleSubredditChange(subreddit) {
    this.setState({ atEnd: false, subreddit: subreddit });
    this.refs.filter.resetFilter();
    this.refs.posts.generatePosts(subreddit, 'after', '', 'hot', this.state.currentListing.sortBy);
    this.refs.navigation.resetPageCounter();
  }

  handleFilterChange(filter) {
    if (filter !== this.state.currentListing.filter) {
      if (filter === 'top') {
        this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', '', filter, this.state.currentListing.sortBy);
        this.refs.filter.setFilter(filter);
      } else {
        this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', '', filter, this.state.currentListing.sortBy);
        this.refs.filter.setFilter(filter);
      }
      this.setState({currentListing: {filter: filter}, atEnd: false});
      this.refs.navigation.resetPageCounter();
    }
  }

  handleSortByChange(sortBy) {
    this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', '', 'top', sortBy);
    this.setState({currentListing: {sortBy: sortBy}, atEnd: false});
    this.refs.navigation.resetPageCounter();
  } 

  handleForwardClick() {
    this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', this.refs.posts.state.lastPostId, this.state.currentListing.filter, this.state.currentListing.sortBy, true);
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  handleBackwardClick(pageCount) {
    if (this.state.atEnd === true) { this.setState({atEnd: false}) }
    if (pageCount === 2) {
      this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', '', this.state.currentListing.filter, this.state.currentListing.sortBy, true);
    } else {
      this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'before', this.refs.posts.state.firstPostId, this.state.currentListing.filter, this.state.currentListing.sortBy, true);
    }
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  removeForwardArrows() {
    this.setState({atEnd: true});
  }

  handlePopState(e) {
    this.refs.navigation.resetPageCounter();
    try {
      this.nextListing = {
        subreddit: e.state.subreddit,
        filter: e.state.filter,
        sortBy: e.state.sortBy,
        timestamp: e.state.timestamp,
      }
      // Used to set proper filter
      if (this.state.currentListing.filter !== e.state.filter) { this.refs.filter.setFilter(e.state.filter); }
  
      this.refs.posts.generatePosts(e.state.subreddit, 'after', '', e.state.filter, e.state.sortBy, true);
      this.setState({
        currentListing: {
          subreddit: e.state.subreddit,
          filter: e.state.filter,
          sortBy: e.state.sortBy,
          timestamp: e.state.timestamp
        },
        atEnd: false
      });
    } catch(e) {
      console.log('No more posts to load');
    }
  }

  render() {
    return(
      <div className='page-container'>
        <div className='options-container'>
          <Filter ref='filter' 
            handleFilterChange={this.handleFilterChange} 
            handleSortByChange={this.handleSortByChange} 
            sortBy={this.state.currentListing.sortBy}/>
          <SubredditInput 
            handleSubredditChange={this.handleSubredditChange} 
            subreddit={this.state.currentListing.subreddit}/>
        </div>
        <Animated animationIn='fadeIn' isVisible={true} className='animation-styles'>
          <Posts 
            ref='posts' 
            className='animation-props' 
            removeForwardArrows={this.removeForwardArrows}
            subreddit={this.state.subreddit}
            handleSubredditChange={this.handleSubredditChange}
            setHistory={this.setHistory}/>
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
