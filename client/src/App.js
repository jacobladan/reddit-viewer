import React, { Component } from 'react';
import { Logo } from './components/main-page/logo';
import { Posts } from './components/main-page/posts';
import { Filter } from './components/main-page/filter';
import { Animated } from "react-animated-css";
import { Navigation } from './components/main-page/navigation';
import { animateScroll as scroll } from 'react-scroll';
import { SubredditInput } from './components/main-page/subreddit-input';
import './styles/main-page-styles.css';
// import './server';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      atEnd: false,
      currentListing: {
        subreddit: 'heroesofthestorm',
        id: '',
        filter: '',
        sortBy: '',
        timestamp: ''
      }
    };

    // Used to update GUI for next generatePosts when using popstate
    this.nextListing = {
      subreddit: '',
      id: '',
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
    this.backwardsPageIds = {};
  }

  componentDidMount() {
    window.onpopstate = this.handlePopState.bind(this);
  }

  setHistory(subreddit, id, filter, sortBy) {
    let url = subreddit + '+' + id + '+' + filter + '+' + sortBy;
    let timestamp = Date.now();
    this.setState({
      currentListing: {
        subreddit: subreddit,
        id: id,
        filter: filter,
        sortBy: sortBy,
        timestamp: timestamp
      }
    });
    let data = {
        subreddit: subreddit,
        id: id,
        filter: filter,
        sortBy: sortBy,
        timestamp: timestamp
    }
    // Only pushing history if id has been used to generate posts. Gets around double render from <Posts />
    if (id === '') { window.history.pushState(data, null, url); }
    console.log(this.state.currentListing);
  }

  // TODO: Add forward and backward check. When navigating forward, filter shouldn't keep previous'
  // Add timestamp to pushState data object. Compare it when popStating to one set in app State
  handleSubredditChange(subreddit) {
    this.setState({ atEnd: false, subreddit: subreddit });
    this.refs.filter.resetFilter();
    this.refs.posts.generatePosts(subreddit, 'after', '', 'hot', '');
    this.refs.navigation.resetPageCounter();
  }

  handleFilterChange(filter) {
    if (filter !== this.state.currentListing.filter) {
      if (filter === 'top') {
        this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', '', filter, this.state.currentListing.sortBy);
        this.refs.filter.setFilter(filter);
      } else {
        this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', '', filter, '');
        this.refs.filter.setFilter(filter);
      }
      this.setState({currentListing: {filter: filter}, atEnd: false});
      this.refs.navigation.resetPageCounter();
    }
  }

  handleSortByChange(sortBy) {
    this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', '', 'top', sortBy);
    this.setState({currentListing: {sortBy: sortBy}});
    this.refs.navigation.resetPageCounter();
  } 

  handleForwardClick(pageCount) {
    // backwardsPageIds is used to store the last post ID of each page when navigating forward
    // This is then referenced in handleBackwardClick() in order to know which post to load after
    this.backwardsPageIds[pageCount + 1] = this.refs.posts.state.lastPostId;
    this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', this.refs.posts.state.lastPostId, this.state.currentListing.filter, this.state.currentListing.sortBy);
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  handleBackwardClick(pageCount) {
    if (this.state.atEnd === true) { this.setState({atEnd: false}) }
    if (pageCount === 2) {
      this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', '', this.state.currentListing.filter, this.state.currentListing.sortBy);
    } else {
      this.refs.posts.generatePosts(this.state.currentListing.subreddit, 'after', this.backwardsPageIds[pageCount - 1], this.state.currentListing.filter, this.state.currentListing.sortBy);
    }
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  removeForwardArrows() {
    this.setState({atEnd: true});
  }

  handlePopState(e) {
    this.nextListing = {
      subreddit: e.state.subreddit,
      id: e.state.id,
      filter: e.state.filter,
      sortBy: e.state.sortBy,
      timestamp: e.state.timestamp,
    }
    if (this.state.currentListing.filter !== e.state.filter) { this.refs.filter.setFilter(e.state.filter); }
    this.setState({
      currentListing: {
        subreddit: e.state.subreddit,
        id: e.state.id,
        filter: e.state.filter,
        sortBy: e.state.sortBy,
        timestamp: e.state.timestamp
      }
    });
    this.refs.posts.generatePosts(e.state.subreddit, 'after', e.state.id, e.state.filter, e.state.sortBy, true);
  }

  render() {
      return(
        <div className='page-container'>
          <Logo />
          <div className='options-container'>
            <Filter ref='filter' handleFilterChange={this.handleFilterChange} handleSortByChange={this.handleSortByChange} sortBy={this.state.currentListing.sortBy}/>
            <SubredditInput handleSubredditChange={this.handleSubredditChange} subreddit={this.state.currentListing.subreddit}/>
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
