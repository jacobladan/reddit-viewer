import React, { Component } from 'react';
import { Logo } from './components/main-page/logo';
import { Post } from './components/main-page/post';
import { Filter } from './components/main-page/filter';
import { Animated } from "react-animated-css";
import { Navigation } from './components/main-page/navigation';
import { animateScroll as scroll } from 'react-scroll';
import './styles/main-page-styles.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: 'hot',
      sortBy: '',
    };
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortByChange = this.handleSortByChange.bind(this);
  }



  handleFilterChange(filter) {
    this.setState({filter: filter});
    if (filter === 'top') {
      this.refs.post.generatePosts('heroesofthestorm', 'after', '', filter, '&t=hour');
    } else {
      this.refs.post.generatePosts('heroesofthestorm', 'after', '', filter, '');
    }
    this.refs.navigation.resetPageCounter();
  }

  handleSortByChange(sortBy) {
    this.setState({sortBy: sortBy});
    this.refs.post.generatePosts('heroesofthestorm', 'after', '', this.state.filter, sortBy);
    this.refs.navigation.resetPageCounter();
  }

  handleForwardClick() {
    this.refs.post.generatePosts('heroesofthestorm', 'after', this.refs.post.state.lastPostId, this.state.filter, this.state.sortBy);
    scroll.scrollToTop({duration: 300});
  }

  handleBackwardClick() {
    this.refs.post.generatePosts('heroesofthestorm', 'before', this.refs.post.state.firstPostId, this.state.filter, this.state.sortBy);
    scroll.scrollToTop({duration: 300});
  }

  render() {
      return(
        <div className='page-container'>
          <Logo />
          <Filter handleFilterChange={this.handleFilterChange} handleSortByChange={this.handleSortByChange}/>
          <Animated animationIn='fadeIn' isVisible={true} className='animation-styles'>
            <Post ref='post' className='animation-props'/>
          </Animated>
          <Navigation ref='navigation' onForwardClick={this.handleForwardClick} onBackwardClick={this.handleBackwardClick}/>
        </div>
      );
    }
}




export default App;
