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
import './styles/themes/dark-theme.css';
import './styles/themes/light-theme.css';
import './styles/responsive-styles.css';
import { SettingsMenu } from './components/main-page/settings-menu';

// TODO: Convert generatePosts param to object

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      atEnd: false,
      subNotFound: false,
      nsfwFilter: true,
      isDarkTheme: false,
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
    this.toggleTheme = this.toggleDarkTheme.bind(this);
    this.filter = React.createRef();
    this.posts = React.createRef();
    this.navigation = React.createRef();
    this.optionsContainer = React.createRef();
    this.theme = 'light';
  }

  componentWillMount() {
    if (typeof(Storage) !== 'undefined') { 
      if (localStorage.getItem('theme') === 'dark') {
        this.theme = localStorage.getItem('theme');
        this.setState({isDarkTheme: true}); 
      }
    }
  }

  componentDidMount() {
    // Assigning popstate to my own handle
    window.onpopstate = this.handlePopState.bind(this);
    // Assigning onbeforeunload to my own handle
    window.onbeforeunload = this.saveThemeToLocalStorage.bind(this);
  }

  saveThemeToLocalStorage() {
    localStorage.setItem('theme', sessionStorage.theme);
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
    this.posts.current.generatePosts(this.state.currentListing.subreddit, 'after', '', this.state.currentListing.filter, this.state.currentListing.sortBy);
  }

  toggleDarkTheme(isDarkTheme) {
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

  render() {
    return(
      <div className={`page-background page-background-${this.theme}`}>
        <div className={`page-container page-container-${this.theme}`}>
          <SubTitle subreddit={this.state.currentListing.subreddit} theme={this.theme}/>
          <div className='options-container' ref={this.optionsContainer}>
            <Filter 
              ref={this.filter} 
              handleFilterChange={this.handleFilterChange} 
              handleSortByChange={this.handleSortByChange} 
              sortBy={this.state.currentListing.sortBy}
              theme={this.theme}/>
            <div className='right-options-container' >
              <SubredditInput 
              handleSubredditChange={this.handleSubredditChange} 
              subreddit={this.state.currentListing.subreddit}
              className='subreddit-form-container-desktop'
              theme={this.theme}/>
              <SettingsMenu toggleNSFW={this.toggleNSFW} 
                          nsfwFilter={this.state.nsfwFilter} 
                          handleSubredditChange={this.handleSubredditChange}
                          toggleDarkTheme={this.toggleTheme}
                          theme={this.theme}
                          isDarkTheme={this.state.isDarkTheme}/>
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
              nsfwFilter={this.state.nsfwFilter}
              theme={this.theme}/>
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
