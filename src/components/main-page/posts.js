import React from 'react';
import { SubredditAPI, defaultSubreddit } from '../../api/subreddit-api';
import { Thumbnail } from './thumbnail';
import { PostInfo } from './post-info';
import { Points } from './points';
import { PostBody } from './post-body';
import { GridLoader } from 'react-spinners';
import { SubredditSuggestion } from './subreddit-suggestion';
import SadFace from '../../images/sad-face.svg';

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
            subreddit: defaultSubreddit,
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
        this.SubredditSuggestion = React.createRef();
        this.theme = 'light';
    }

    componentDidMount() {
        this.generatePosts(this.state.subreddit, '', '', 'hot', 'hour');
    }

    scrollToTopOfPost(id) {
        let height = this.postBodyRefs[id].clientHeight;
        if (height > 600) {
            window.scrollBy(0, (height * -1) + 200);
        }
    }

    highlightPost(id) {
        if (this.state.highlightPost !== '') {
            this.postBodyRefs[this.state.highlightPost].classList.remove('highlighted-post', `highlighted-post-${this.props.theme}`);
        }
        this.postBodyRefs[id].classList.add('highlighted-post', `highlighted-post-${this.props.theme}`);
        this.setState({highlightPost: id});
    }

    clearPostRefs() {
        for (const prop of Object.getOwnPropertyNames(this.postBodyRefs)) {
            delete this.postBodyRefs[prop];
        }
    }

    // componentWillReceiveProps() {
    //     // Logic is backwards due to generatePosts() not seeing darkTheme prop until after returning 
    //     if (this.props.darkTheme) {
    //         this.theme = 'light';
    //     } else {
    //         this.theme = 'dark';
    //     }
    // }

    generatePosts(subreddit, direction, id, filter, sortBy, isFromHistory) {
        // first and lastIds are being used to track page navigation. See ../../api/subreddit-api.js
        let firstPostId, lastPostId, posts;
        this.setState({fetchInProgress: true, postsWereFetched: true, subredditWasFound: true, highlightPost: ''});
        const fetch = new SubredditAPI(subreddit, direction, id, filter, sortBy);
        fetch.then(data => {
            // console.log(data);
            let i = 0;
            if (typeof(data) === 'undefined') {
                this.setState({subredditWasFound: false, fetchInProgress: false});
                this.SubredditSuggestion.current.getSuggestions(subreddit); 
                this.props.removeForwardArrows(true);
            } else if (data.data.children.length === 0) { 
                this.setState({postsWereFetched: false, fetchInProgress: false}); 
                this.props.removeForwardArrows(true);
            } else { 
                firstPostId = data.data.children[0].data.id;
                if (data.data.children.length < 25) { this.props.removeForwardArrows(); }
                posts = data.data.children.map(post => {

                    let previewUrl, domain = post.data.domain;
                    let body = false;
                    if (this.props.nsfwFilter && post.data.over_18) { return null }
                    // Checks for post body. TODO: Try and find a more unified way of identifying post body
                    if (domain === 'i.imgur.com' || domain === 'v.reddit.com' || domain === 'gfycat.com' 
                        || domain === 'i.redd.it' || post.data.media !== null || post.data.selftext_html 
                        || domain === 'giant.gfycat.com') {

                        if (post.data.domain !== 'v.redd.it') { body = true }

                    }

                    let authorLink = 'https://www.reddit.com/user/' + post.data.author;
                    lastPostId = post.data.id;
                    // Thumbnail checks
                    if (typeof(post.data.preview) !== 'undefined'){
                        if (post.data.thumbnail === 'self') {
                            previewUrl = post.data.preview.images[0].source.url;
                        } 
                        else {
                            previewUrl = post.data.thumbnail;
                        }
                    } else { 
                        previewUrl = 'default'; 
                    }
                    i++;
                    return (
                            <div className={`post-container post-container-${this.props.theme}`} key={post.data.id} ref={node => { this.postBodyRefs[post.data.id] = node; }}>
                                <div className='post-header'>
                                    <Thumbnail href={post.data.url} src={previewUrl} over_18={post.data.over_18}/>
                                    <PostInfo 
                                    link={post.data.url} 
                                    title={decodeHTML(post.data.title)}
                                    authorLink={authorLink}
                                    author={post.data.author} 
                                    domain={domain}
                                    created={post.data.created_utc}
                                    stickied={post.data.stickied}
                                    spoiler={post.data.spoiler}
                                    postSubreddit={post.data.subreddit}
                                    passedSubreddit={subreddit}
                                    handleSubredditChange={this.props.handleSubredditChange}
                                    permaLink={post.data.permalink}
                                    over_18={post.data.over_18}
                                    num_comments={post.data.num_comments}
                                    theme={this.props.theme}
                                    />
                                    <Points theme={this.props.theme} points={post.data.score}/>
                                </div>{
                                        // Checking if post has a body. If not, then no expand button or
                                        // post body place holder is rendered
                                        body
                                        ? <PostBody postId={post.data.id}
                                            subreddit={post.data.subreddit}
                                            scrollToTopOfPost={this.scrollToTopOfPost}
                                            highlightPost={this.highlightPost}
                                            theme={this.props.theme}/>
                                        : null
                                    }
                            </div>
                        );
                    })
                    this.setState({
                        posts: posts,
                        subreddit: subreddit,
                        firstPostId: firstPostId,
                        lastPostId: lastPostId,
                        fetchInProgress: false,
                        subredditWasFound: true,
                        postsWereFetched: (i !== 0)
                    });
                }
            if (i === 0) {this.props.removeForwardArrows(true)}
            if (!isFromHistory) { this.props.setHistory(subreddit, firstPostId, lastPostId, filter, sortBy) }
        })
    }

    render() {
        if (!this.state.subredditWasFound){
            return (
                <div className={`no-posts-container no-posts-container-${this.props.theme}`}>
                    <img src={SadFace} alt='sad face' className='sad-face-img'/>
                    <p className='no-posts-message'>That subreddit doesn't exist</p>
                    <div className='horizontal-line'></div>
                    <SubredditSuggestion 
                        ref={this.SubredditSuggestion}
                        subreddit={this.state.subreddit} 
                        handleSubredditChange={this.props.handleSubredditChange}
                        theme={this.props.theme}/>
                </div>
            );
        } else if (!this.state.postsWereFetched) {
            return (
                <div className={`no-posts-container no-posts-container-${this.props.theme}`}>
                    <img src={SadFace} alt='sad face' className='sad-face-img'/>
                    <p className='no-posts-message'>There doesn't seem to be anything here...</p>
                </div>
            );
        } else {
            return (
                <div className='content-container'> {
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