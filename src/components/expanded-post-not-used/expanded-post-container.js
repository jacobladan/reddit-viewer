import React from 'react';
import './expanded-post-styles.css';
import { PostAPI } from '../../api/reddit-hots-api';
import { Thumbnail } from '../main-page/thumbnail';
import { PostInfo } from '../main-page/post-info';

let dateOptions = {
    weekday: 'long',
    month: 'long',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
};

export class ExpandedPostContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            post: {
                url: '',
                previewUrl: '',
                title: '',
                authorLink: '',
                author: '',
                domain: '',
                createdDate: '',
                stickied: false 
            }
        };
    }

    componentDidMount(){
        let getPost = new PostAPI();
        let previewUrl;
        getPost.then(data => {
            let post = data[0].data.children[0].data;
            if (typeof(post.preview) !== 'undefined'){
                previewUrl = post.preview.images[0].source.url;
            } else {
                previewUrl = 'https://www.reddit.com/static/self_default2.png';
            }
            let createdDate = new Date(post.created * 1000).toLocaleDateString("en-US", dateOptions);
            this.setState({
                post: {
                    url: post.url,
                    previewUrl: previewUrl,
                    title: post.title,
                    authorLink: 'https://www.reddit.com/user/' + post.author,
                    author: post.author,
                    domain: post.domain,
                    createdDate: createdDate,
                    stickied: post.stickied 
                }
            });
        })
    }

    render() {
        console.log(this.state.post);
        return (
            <div className='expanded-post-container'>
                <Thumbnail aClass='expanded-thumbnail' imgClass='expanded-img' href={this.state.post.url} src={this.state.post.previewUrl}/>
                <PostInfo 
                    link={this.state.post.url} 
                    title={this.state.post.title}
                    authorLink={this.state.post.authorLink}
                    author={this.state.post.author} 
                    domain={this.state.post.domain}
                    created={this.state.post.createdDate}
                    stickied={this.state.post.stickied}
                    titleClass='expanded-title'
                />
            </div>
        );
    }
}