import React, { Component } from 'react';
import { Posts } from './components/main-page/posts';
import { PostFilter } from './components/main-page/post-filter';
import { Animated } from "react-animated-css";
import { Navigation } from './components/main-page/navigation';
import { animateScroll as scroll } from 'react-scroll';
import { SubredditInput } from './components/main-page/subreddit-input';
import { SubTitle } from './components/main-page/sub-title';
import { defaultSubreddit } from './api/subreddit-api';
import { SettingsMenu } from './components/main-page/settings-menu';
import { CommentsContainer } from './components/main-page/comments-container';
import './styles/main-page-styles.css';
import './styles/themes/dark-theme.css';
import './styles/themes/light-theme.css';
import './styles/responsive-styles.css';

// TODO: Convert generatePosts param to object 
// TODO: Convert components with a lot of props to use a single prop object
// TODO: Add dialog for no comments
// **** CHANGE Mobile input to reflect subreddit currently on

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      atEnd: false,
      subNotFound: false,
      nsfwFilter: true,
      isDarkTheme: false,
      isCommentsVisible: false,
      currentListing: {
        subreddit: defaultSubreddit,
        id: '',
        filter: '',
        sortBy: 'hour',
      },
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
    this.toggleTheme = this.toggleTheme.bind(this);
    this.generateComments = this.generateComments.bind(this);
    this.filter = React.createRef();
    this.posts = React.createRef();
    this.navigation = React.createRef();
    this.optionsContainer = React.createRef();
    this.commentsContainer = React.createRef();
    this.settingsMenu = React.createRef();
    this.theme = 'light';
    this.pageContainerDisplay = {display: 'block'};
    this.commentsContainerDisplay = {display: 'none'};
  }

  componentWillMount() {
    let isDarkTheme = false, nsfwFilter = false, subreddit = defaultSubreddit;
    if (typeof(Storage) !== 'undefined') { 
      // Checking if theme is set in storage
      if (typeof(localStorage.getItem('theme') !== 'undefined')) {
        // Checking if it's value is defined or not
        if (localStorage.getItem('theme') !== null) {
          // If it has a value, set the theme to it
          this.theme = localStorage.getItem('theme');
          if (this.theme === 'dark') { 
            isDarkTheme = true; 
          }
        } else {
          this.theme = 'light';
        }
      } else {
        this.theme = 'light;'
        this.isDarkTheme = false;
      }
      if (typeof(localStorage.getItem('nsfwFilter') !== 'undefined')) {
        if (localStorage.getItem('nsfwFilter') !== 'undefined') {
          if (localStorage.getItem('nsfwFilter') === 'false') { 
            nsfwFilter = false; 
          }
          else { 
            nsfwFilter = true; 
          }
        } else {
          nsfwFilter = true;
        }
      } else {
        nsfwFilter = false;
      }
      if (typeof(localStorage.getItem('subreddit') !== 'undefined')) {
        if (typeof(localStorage.getItem('subreddit')) === 'string') {
          subreddit = localStorage.getItem('subreddit');
        } else { 
          subreddit = defaultSubreddit;
        }
      } else {
        subreddit = defaultSubreddit;
      }
      sessionStorage.setItem('nsfwFilter', nsfwFilter);
      sessionStorage.setItem('subreddit', subreddit);
      sessionStorage.setItem('theme', this.theme);
      this.setState({isDarkTheme: isDarkTheme, nsfwFilter: nsfwFilter, currentListing: {subreddit: subreddit}});
    } 
  }

  componentDidMount() {
    // Assigning popstate to my own handle
    window.onpopstate = this.handlePopState.bind(this);
    // Assigning onbeforeunload to my own handle
    window.onbeforeunload = this.saveThemeToLocalStorage.bind(this);
  }

  saveThemeToLocalStorage() {
    if (typeof(sessionStorage.theme) !== 'undefined') {
      localStorage.setItem('theme', sessionStorage.theme);
    } else {
      localStorage.setItem('theme', this.theme);
    }

    if (typeof(sessionStorage.nsfwFilter) !== 'undefined') {
      localStorage.setItem('nsfwFilter', sessionStorage.nsfwFilter);
    } else {
      localStorage.setItem('nsfwFilter', this.state.nsfwFilter);
    }

    if (typeof(sessionStorage.subreddit) !== 'undefined') {
      localStorage.setItem('subreddit', sessionStorage.subreddit);
    } else {
      localStorage.setItem('subreddit', this.state.currentListing.subreddit);
    }
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

  handleSubredditChange(subreddit, isFromSttingsMenu) {
    this.setState({ atEnd: false, subreddit: {currentListing: subreddit}, subNotFound: false, isCommentsVisible: false });
    sessionStorage.setItem('subreddit', subreddit);
    this.pageContainerDisplay = {display: 'block'};
    this.commentsContainerDisplay = {display: 'none'};
    this.posts.current.generatePosts(subreddit, 'after', '', this.state.currentListing.filter, this.state.currentListing.sortBy);
    this.navigation.current.resetPageCounter();
    scroll.scrollToTop({duration: 500, smooth: true});
    if (isFromSttingsMenu) {
      this.settingsMenu.current.closeMenu();
    }
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
    sessionStorage.setItem('nsfwFilter', !this.state.nsfwFilter);
    this.setState({nsfwFilter: !this.state.nsfwFilter, atEnd: false, subNotFound: false});
    this.navigation.current.resetPageCounter();
    this.posts.current.generatePosts(this.state.currentListing.subreddit, 'after', '', this.state.currentListing.filter, this.state.currentListing.sortBy);
  }

  toggleTheme(isDarkTheme) {
    if (!isDarkTheme) {
      this.theme = 'dark';
    } else {
      this.theme = 'light';
    }
    sessionStorage.setItem('theme', this.theme);
    this.setState({isDarkTheme: !this.state.isDarkTheme, atEnd: false, subNotFound: false});
    this.navigation.current.resetPageCounter();
    this.posts.current.generatePosts(this.state.currentListing.subreddit, 'after', this.state.currentListing.id, this.state.currentListing.filter, this.state.currentListing.sortBy);
  }

  generateComments(id) {
    scroll.scrollToTop({duration: 500, smooth: true});
    this.commentsContainer.current.generateComments(this.state.currentListing.subreddit, id, 'top');
    this.posts.current.highlightPost(id);
    this.setState({isCommentsVisible: true});
    this.pageContainerDisplay = {display: 'none'};
    this.commentsContainerDisplay = {display: 'block'};
  }

  handlePopState(e) {
    if (this.state.isCommentsVisible === true) {
      this.setHistory(this.state.currentListing.subreddit, '', '', this.state.currentListing.filter, this.state.currentListing.sortBy);
      this.pageContainerDisplay = {display: 'block'};
      this.commentsContainerDisplay = {display: 'none'};
      this.setState({isCommentsVisible: false});
    } else {
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
        sessionStorage.setItem('subreddit', e.state.subreddit);
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
  }

  render() {
    return(
      <div className={`page-background page-background-${this.theme}`}>
        <Animated animationIn='fadeIn' isVisible={this.state.isCommentsVisible} className='animation-styles'>
          <CommentsContainer ref={this.commentsContainer} 
          display={this.commentsContainerDisplay} 
          theme={this.theme}
          handleSubredditChange={this.handleSubredditChange}/>
        </Animated>
        <div className={`page-container page-container-${this.theme}`} style={this.pageContainerDisplay}>
          <SubTitle subreddit={this.state.currentListing.subreddit} theme={this.theme}/>
          <div className='options-container' ref={this.optionsContainer}>
            <PostFilter 
              ref={this.filter} 
              handleFilterChange={this.handleFilterChange} 
              handleSortByChange={this.handleSortByChange} 
              sortBy={this.state.currentListing.sortBy}
              theme={this.theme}/>
            <div className='right-options-container'>
              <SubredditInput 
              handleSubredditChange={this.handleSubredditChange} 
              subreddit={this.state.currentListing.subreddit}
              className='subreddit-form-container-desktop'
              theme={this.theme}/>
              <SettingsMenu toggleNSFW={this.toggleNSFW} 
                          nsfwFilter={this.state.nsfwFilter} 
                          handleSubredditChange={this.handleSubredditChange}
                          toggleTheme={this.toggleTheme}
                          theme={this.theme}
                          isDarkTheme={this.state.isDarkTheme}
                          subreddit={this.state.currentListing.subreddit}
                          ref={this.settingsMenu}/>
            </div>
          </div>
          <Animated animationIn='fadeIn' isVisible={true} className='animation-styles'>
            <Posts 
              ref={this.posts} 
              className='animation-props' 
              removeForwardArrows={this.removeForwardArrows}
              subreddit={this.state.currentListing.subreddit}
              handleSubredditChange={this.handleSubredditChange}
              setHistory={this.setHistory}
              nsfwFilter={this.state.nsfwFilter}
              theme={this.theme}
              generateComments={this.generateComments}/>
          </Animated>
          <Navigation 
            ref={this.navigation} 
            onForwardClick={this.handleForwardClick} 
            onBackwardClick={this.handleBackwardClick}
            atEnd={this.state.atEnd}
            subNotFound={this.state.subNotFound}
            theme={this.theme}/>
        </div>
      </div>
    );
  }
}

export default App;
