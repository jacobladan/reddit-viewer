import React from 'react';
import { SubredditAPI } from '../../api/subreddit-api';
import { Thumbnail } from './thumbnail';
import { PostInfo } from './post-info';
import { Points } from './points';
import { PostBody } from './post-body';
import { GridLoader } from 'react-spinners';

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

export class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            firstPostId: '',
            lastPostId: '',
            fetchInProgress: true,
        };
    }

    componentDidMount() {
        this.generatePosts('heroesofthestorm', '', '', 'hot', '');
    }

    generatePosts(subreddit, direction, id, filter, sortBy) {
        // i is being used to track which post is first for use in navigating pages
        let firstPostId, lastPostId, i = 0;
        this.setState({fetchInProgress: true});
        const posts = new SubredditAPI(subreddit, direction, id, filter, sortBy);
        posts.then(data => {
            if (data === undefined) { return }
            // Skips pinned posts
            if (data.data.children.length <= 2) { return }
            let posts = data.data.children.map(post => {
                let previewUrl;
                let bodyText = post.data.selftext_html;
                let authorLink = 'https://www.reddit.com/user/' + post.data.author;
                let createdDate = new Date(post.data.created * 1000).toLocaleDateString("en-US", dateOptions);
                if (i === 0) {firstPostId = post.data.id}
                lastPostId = post.data.id;
                // Checks to set default thumbnail if none is set in the post
                if (typeof(post.data.preview) !== 'undefined'){
                    previewUrl = post.data.preview.images[0].source.url;
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
                                />
                                <Points points={post.data.score}/>
                            </div>
                                {
                                    // Checking if post has a body. If not, then no expand button or
                                    // post body place holder is rendered
                                    bodyText
                                    ? <PostBody postId={post.data.id} />
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
                });
            })
    }

    render() {
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