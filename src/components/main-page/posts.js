import React from 'react';
import { SubredditAPI, subredditDefault } from '../../api/subreddit-api';
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
            subreddit: subredditDefault,
            firstPostId: '',
            lastPostId: '',
            fetchInProgress: true,
            postsWereFetched: true,
            subredditWasFound: true
        };
        this.postBodyRefs = {};
        this.scrollToTopOfPost = this.scrollToTopOfPost.bind(this);
    }

    componentDidMount() {
        this.generatePosts(this.state.subreddit, '', '', 'hot', '');
    }

    scrollToTopOfPost(id) {
        // console.log(this.postBodyRefs[id].getBoundingClientRect().x);
        // console.log(parseInt(document.documentElement.scrollTop,10))
        window.scrollTo(0, this.postBodyRefs[id].getBoundingClientRect().x + parseInt(document.documentElement.scrollTop,10));
    }

    generatePosts(subreddit, direction, id, filter, sortBy) {
        // i is being used to track which post is first for use in navigating pages
        let firstPostId, lastPostId, i = 0, posts;
        this.setState({fetchInProgress: true, postsWereFetched: true});
        const fetch = new SubredditAPI(subreddit, direction, id, filter, sortBy);
        fetch.then(data => {
            // console.log(data);
            if (typeof(data) === 'undefined') {
                this.setState({subredditWasFound: false, fetchInProgress: false}); 
                this.props.removeForwardArrows();
            } else if (data.data.children.length === 0) { 
                this.setState({postsWereFetched: false, fetchInProgress: false}); 
                this.props.removeForwardArrows();
            } else { 
                posts = data.data.children.map(post => {
                    let previewUrl;
                    let bodyText = post.data.selftext_html;
                    let authorLink = 'https://www.reddit.com/user/' + post.data.author;
                    let createdDate = new Date(post.data.created * 1000).toLocaleDateString("en-US", dateOptions);
                    if (i === 0) {firstPostId = post.data.id}
                    lastPostId = post.data.id;
                    // console.log(post.data.title + ':');
                    // console.log(post.data)
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
                    i++;
                    return (
                            <div className='post-container' key={post.data.id}>
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
                                    />
                                    <Points points={post.data.score}/>
                                </div>{
                                        // Checking if post has a body. If not, then no expand button or
                                        // post body place holder is rendered
                                        bodyText
                                        ? <div ref={node => { this.postBodyRefs[post.data.id] = node; }}><PostBody postId={post.data.id}
                                            subreddit={post.data.subreddit}
                                            scrollToTopOfPost={this.scrollToTopOfPost}/></div>
                                        : null
                                    }
                            </div>
                        );
                    })
                this.setState({
                     posts: posts,
                    lastPostId: lastPostId,
                    firstPostId: firstPostId,
                    fetchInProgress: false,
                    subredditWasFound: true,
                });
            }
           
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