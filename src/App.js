import React, { Component } from 'react';
import { Post } from './components/post';
import { Logo } from './components/logo';
import { Navigation } from './components/navigation';
import './styles/styles.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleForwardClick = this.handleForwardClick.bind(this);
    this.handleBackwardClick = this.handleBackwardClick.bind(this);
  }

  handleForwardClick() {
    this.refs.post.generatePosts('after', this.refs.post.state.lastPostId);
  }

  handleBackwardClick() {
    this.refs.post.generatePosts('before', this.refs.post.state.firstPostId);
  }

  render() {
    return (
      <div className='page-container'>
        <Logo />
        <Post ref='post'/>
        <Navigation onForwardClick={this.handleForwardClick} onBackwardClick={this.handleBackwardClick}/>
      </div>
    );
  }
}

export default App;
