import React from 'react';
import { SubredditAPI } from '../../api/subreddit-api';
import { Thumbnail } from './thumbnail';
import { PostInfo } from './post-info';
import { Points } from './points';
import { PostBody } from './post-body';
import { GridLoader } from 'react-spinners';
import SadFace from '../../images/sad-face.svg';

const dateOptions = {
    weekday: 'long',
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
};

let decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

export class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            subreddit: 'all',
            firstPostId: '',
            lastPostId: '',
            highlightPost: '',
            fetchInProgress: true,
            postsWereFetched: true,
            subredditWasFound: true,
        };
        this.postBodyRefs = {};
        this.scrollToTopOfPost = this.scrollToTopOfPost.bind(this);
        this.highlightPost = this.highlightPost.bind(this);
    }

    componentDidMount() {
        this.generatePosts(this.state.subreddit, '', '', 'hot', 'hour')
    }

    scrollToTopOfPost(id) {
        let height = this.postBodyRefs[id].clientHeight;
        if (height > 600) {
            window.scrollBy(0, height * -1);
        }
    }

    highlightPost(id) {
        if (this.state.highlightPost !== '') {
            this.postBodyRefs[this.state.highlightPost].classList.remove('highlighted-post');
        }
        this.postBodyRefs[id].classList.add('highlighted-post');
        this.setState({highlightPost: id});
    }

    clearPostRefs() {
        for (const prop of Object.getOwnPropertyNames(this.postBodyRefs)) {
            delete this.postBodyRefs[prop];
        }
    }

    generatePosts(subreddit, direction, id, filter, sortBy, isFromHistory) {
        // first and lastIds are being used to track page navigation. See ../../api/subreddit-api.js
        let firstPostId, lastPostId, posts;
        this.setState({fetchInProgress: true, postsWereFetched: true, highlightPost: ''});
        const fetch = new SubredditAPI(subreddit, direction, id, filter, sortBy);
        fetch.then(data => {
            console.log(data);
            if (typeof(data) === 'undefined') {
                this.setState({subredditWasFound: false, fetchInProgress: false}); 
                this.props.removeForwardArrows();
            } else if (data.data.children.length === 0) { 
                this.setState({postsWereFetched: false, fetchInProgress: false}); 
                this.props.removeForwardArrows();
            } else { 
                firstPostId = data.data.children[0].data.id;
                let numPosts = data.data.children.length;
                posts = data.data.children.map(post => {
                    let previewUrl;
                    let bodyText = post.data.selftext_html;
                    let authorLink = 'https://www.reddit.com/user/' + post.data.author;
                    let createdDate = new Date(post.data.created * 1000).toLocaleDateString("en-US", dateOptions);
                    if (numPosts < 15) { this.props.removeForwardArrows(); }
                    lastPostId = post.data.id;
                    // console.log(post.data.title + ': ' + post.data.id);
                    // console.log(post.data.postId)
                    // Thumbnail checks
                    if (typeof(post.data.preview) !== 'undefined'){
                        if (post.data.thumbnail === 'self') {
                            previewUrl = post.data.preview.images[0].source.url;
                        } 
                        else {
                            previewUrl = post.data.thumbnail;
                        }
                    } else { 
                        previewUrl = 'https://www.reddit.com/static/self_default2.png'; 
                    }
                    return (
                            <div className='post-container' key={post.data.id} ref={node => { this.postBodyRefs[post.data.id] = node; }}>
                                <div className='post-header'>
                                    <Thumbnail href={post.data.url} src={previewUrl}/>
                                    <PostInfo 
                                    link={post.data.url} 
                                    title={decodeHTML(post.data.title)}
                                    authorLink={authorLink}
                                    author={post.data.author} 
                                    domain={post.data.domain}
                                    created={createdDate}
                                    stickied={post.data.stickied}
                                    spoiler={post.data.spoiler}
                                    postSubreddit={post.data.subreddit}
                                    passedSubreddit={subreddit}
                                    handleSubredditChange={this.props.handleSubredditChange}
                                    permaLink={post.data.permalink}
                                    />
                                    <Points points={post.data.score}/>
                                </div>{
                                        // Checking if post has a body. If not, then no expand button or
                                        // post body place holder is rendered
                                        bodyText
                                        ? <PostBody postId={post.data.id}
                                            subreddit={post.data.subreddit}
                                            scrollToTopOfPost={this.scrollToTopOfPost}
                                            highlightPost={this.highlightPost}/>
                                        : null
                                    }
                            </div>
                        );
                    })
                    this.setState({
                        posts: posts,
                        firstPostId: firstPostId,
                        lastPostId: lastPostId,
                        fetchInProgress: false,
                        subredditWasFound: true,
                    });
                }
            if (!isFromHistory) { this.props.setHistory(subreddit, firstPostId, lastPostId, filter, sortBy) }
        })
    }

    render() {
        if (!this.state.subredditWasFound){
            return (
                <div className='no-posts-container'>
                    <p>that subreddit does not exist</p>
                    <img src={SadFace} alt='sad face' className='sad-face-img'/>
                </div>
            );
        } else if (!this.state.postsWereFetched) {
            return (
                <div className='no-posts-container'>
                    <p>you've reached the end</p>
                    <img src={SadFace} alt='sad face' className='sad-face-img'/>
                </div>
            );
        } else {
            return (
                <div className='content-container' >{
                    // Adds loader icon until the posts are fetched
                    this.state.fetchInProgress
                    ? <div className='post-loader-container'><GridLoader loading={true} color={"#44def3"}/></div>
                    : this.state.posts
                }
                </div>
            ) 
        }
    }
}