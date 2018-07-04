import React, { Component } from 'react';
import { Posts } from './components/main-page/posts';
import { Filter } from './components/main-page/filter';
import { Animated } from "react-animated-css";
import { Navigation } from './components/main-page/navigation';
import { animateScroll as scroll } from 'react-scroll';
import { SubredditInput } from './components/main-page/subreddit-input';
import { SubTitle } from './components/main-page/sub-title';
import { defaultSubreddit } from './api/subreddit-api';
import './styles/main-page-styles.css';
import './styles/responsive-styles.css';
import { SettingsMenu } from './components/main-page/settings-menu';
// import './server';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      atEnd: false,
      subNotFound: false,
      nsfwFilter: true,
      menuIsOpen: false,
      currentListing: {
        subreddit: defaultSubreddit,
        id: '',
        filter: '',
        sortBy: 'hour',
      }
    };

    // Used to update GUI for next generatePosts when using popstate
    this.nextListing = {
      subreddit: '',
      filter: '',
      sortBy: '',
    }
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortByChange = this.handleSortByChange.bind(this);
    this.removeForwardArrows = this.removeForwardArrows.bind(this);
    this.handleSubredditChange = this.handleSubredditChange.bind(this);
    this.setHistory = this.setHistory.bind(this);
    this.toggleNSFW = this.toggleNSFW.bind(this);
    this.openSettingsMenu = this.openSettingsMenu.bind(this);
    this.closeSettingsMenu = this.closeSettingsMenu.bind(this);
    this.filter = React.createRef();
    this.posts = React.createRef();
    this.navigation = React.createRef();
    this.optionsContainer = React.createRef();
    this.settingsMenu = React.createRef();
  }

  componentDidMount() {
    // Assigning popstate to my own handle
    window.onpopstate = this.handlePopState.bind(this);
  }

  setHistory(subreddit, firstId, lastId, filter, sortBy) {
    let url = subreddit + '+' + filter + '+' + sortBy;
    this.setState({
      currentListing: {
        subreddit: subreddit,
        filter: filter,
        sortBy: sortBy,
      }
    });
    let data = {
        subreddit: subreddit,
        firstId: firstId,
        lastId: lastId,
        filter: filter,
        sortBy: sortBy,
    };
    window.history.pushState(data, null, url);
  }

  handleSubredditChange(subreddit) {
    this.setState({ atEnd: false, subreddit: subreddit, subNotFound: false });
    this.posts.current.generatePosts(subreddit, 'after', '', this.state.currentListing.filter, this.state.currentListing.sortBy);
    this.navigation.current.resetPageCounter();
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  handleFilterChange(filter) {
    if (filter !== this.state.currentListing.filter) {
      if (filter === 'top') {
        this.posts.current.generatePosts(this.state.currentListing.subreddit, 'after', '', filter, this.state.currentListing.sortBy);
        this.filter.current.setFilter(filter);
      } else {
        this.posts.current.generatePosts(this.state.currentListing.subreddit, 'after', '', filter, this.state.currentListing.sortBy);
        this.filter.current.setFilter(filter);
      }
      this.setState({currentListing: {filter: filter}, atEnd: false});
      this.navigation.current.resetPageCounter();
    }
  }

  handleSortByChange(sortBy) {
    this.posts.current.generatePosts(this.state.currentListing.subreddit, 'after', '', 'top', sortBy);
    this.setState({currentListing: {sortBy: sortBy}, atEnd: false});
    this.navigation.current.resetPageCounter();
  } 

  handleForwardClick() {
    this.posts.current.generatePosts(this.state.currentListing.subreddit, 'after', this.posts.current.state.lastPostId, this.state.currentListing.filter, this.state.currentListing.sortBy, true);
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  handleBackwardClick(pageCount) {
    if (this.state.atEnd === true) { this.setState({atEnd: false}) }
    if (pageCount === 2) {
      this.posts.current.generatePosts(this.state.currentListing.subreddit, 'after', '', this.state.currentListing.filter, this.state.currentListing.sortBy, true);
    } else {
      this.posts.current.generatePosts(this.state.currentListing.subreddit, 'before', this.posts.current.state.firstPostId, this.state.currentListing.filter, this.state.currentListing.sortBy, true);
    }
    scroll.scrollToTop({duration: 500, smooth: true});
  }

  removeForwardArrows(subNotFound) {
    if (subNotFound) {
      this.setState({atEnd: true, subNotFound: true})
    } else {
      this.setState({atEnd: true});
    }
  }
    
  toggleNSFW() {
    this.setState({nsfwFilter: !this.state.nsfwFilter});
  }

  handlePopState(e) {
    this.navigation.current.resetPageCounter();
    try {
      this.nextListing = {
        subreddit: e.state.subreddit,
        filter: e.state.filter,
        sortBy: e.state.sortBy,
      }
      // Used to set proper filter
      if (this.state.currentListing.filter !== e.state.filter) { this.filter.current.setFilter(e.state.filter); }
  
      this.posts.current.generatePosts(e.state.subreddit, 'after', '', e.state.filter, e.state.sortBy, true);
      this.setState({
        currentListing: {
          subreddit: e.state.subreddit,
          filter: e.state.filter,
          sortBy: e.state.sortBy,
        },
        atEnd: false,
        subNotFound: false
      });
    } catch(e) {
      console.log('No more posts to load');
    }
  }

  openSettingsMenu(e) {
    e.stopPropagation();
    this.setState({menuIsOpen: true});
  }

  closeSettingsMenu() {
    this.setState({menuIsOpen: false});
  }

  render() {
    return(
      <div className='page-container'>
        <SubTitle subreddit={this.state.currentListing.subreddit}/>
        <div className='options-container' ref={this.optionsContainer}>
          <Filter 
            ref={this.filter} 
            handleFilterChange={this.handleFilterChange} 
            handleSortByChange={this.handleSortByChange} 
            sortBy={this.state.currentListing.sortBy}/>
          <div className='right-options-container' >
            <SubredditInput 
            handleSubredditChange={this.handleSubredditChange} 
            subreddit={this.state.currentListing.subreddit}
            className='subreddit-form-container-desktop'/>
            <SettingsMenu toggleNSFW={this.toggleNSFW} 
                        nsfwFilter={this.state.nsfwFilter} 
                        handleSubredditChange={this.handleSubredditChange}
                        openSettingsMenu={this.openSettingsMenu}
                        closeSettingsMenu={this.closeSettingsMenu}
                        menuIsOpen={this.state.menuIsOpen} 
                        ref={this.settingsMenu}/>
          </div>
        </div>
        <Animated animationIn='fadeIn' isVisible={true} className='animation-styles'>
          <Posts 
            ref={this.posts} 
            className='animation-props' 
            removeForwardArrows={this.removeForwardArrows}
            subreddit={this.state.subreddit}
            handleSubredditChange={this.handleSubredditChange}
            setHistory={this.setHistory}
            nsfwFilter={this.state.nsfwFilter}/>
        </Animated>
        <Navigation 
          ref={this.navigation} 
          onForwardClick={this.handleForwardClick} 
          onBackwardClick={this.handleBackwardClick}
          atEnd={this.state.atEnd}
          subNotFound={this.state.subNotFound}/>
      </div>
    );
  }
}

export default App;
