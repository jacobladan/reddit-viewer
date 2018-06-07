import React from 'react';
import { RedditAPI } from '../../api/reddit-hots-api';
import { Thumbnail } from './thumbnail';
import { PostInfo } from './post-info';
import { Points } from './points';

let dateOptions = {
    weekday: 'long',
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
};

export class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            firstPostId: '',
            lastPostId: '',
        };
    }

    componentDidMount() {
        this.generatePosts('after', '', 'hot', '');
    }

    generatePosts(direction, id, filter, sortBy) {
        const posts = new RedditAPI(direction, id, filter, sortBy);
        let firstPostId, lastPostId, i = 0;
        posts.then(data => {
            console.log(data);
            if (data.data.children.length <= 2) { return }
            let posts = data.data.children.map(post => {
                let previewUrl;
                if (i === 0) {firstPostId = post.data.id}
                if (typeof(post.data.preview) !== 'undefined'){
                    previewUrl = post.data.preview.images[0].source.url;
                } else {
                    previewUrl = 'https://www.reddit.com/static/self_default2.png';
                }
                let authorLink = 'https://www.reddit.com/user/' + post.data.author;
                let createdDate = new Date(post.data.created * 1000).toLocaleDateString("en-US", dateOptions);
                lastPostId = post.data.id;
                i++;
                return (
                        <div className='post-container' key={post.data.id}>
                            <Thumbnail href={post.data.url} src={previewUrl}/>
                            <PostInfo 
                            link={post.data.url} 
                            title={post.data.title}
                            authorLink={authorLink}
                            author={post.data.author} 
                            domain={post.data.domain}
                            created={createdDate}
                            stickied={post.data.stickied}
                            />
                            <Points points={post.data.score}/>
                        </div>
                    );
                })
                this.setState({
                    posts: posts,
                    lastPostId: lastPostId,
                    firstPostId: firstPostId,
                });
                // window.scrollTo(0, 0);
            })
    }

    render() {
        return (
                <div className='content-container'>{this.state.posts}</div>
        ) 
    }
}