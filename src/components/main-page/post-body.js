import React from 'react';
import { PostAPI } from "../../api/subreddit-api";
import { ExpandedPostButton } from '../main-page/expand-post-button';
import { GridLoader } from 'react-spinners';
import ReactHtmlParser from 'react-html-parser';
import { EmbeddedImage } from './embedded-image';
import { EmbeddedVideo } from './embedded-video';
import { EmbeddedLink } from './embedded-link';

let decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

export class PostBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            body: '',
            isPostExpanded: false,
            fetchInProgress: true,
            isBodyLoaded: false
        };
        this.handleClicked = this.handleClicked.bind(this);
    }

    generatePostBody(subreddit, Id) {
        this.setState({fetchInProgress: true});
        const getPost = new PostAPI(subreddit, Id);
        getPost.then(data => {
            // console.log(data);
            if (data === undefined) { return }
            else {
                let body, bodyType;
                let postHint = data[0].data.children[0].data.post_hint;
                let domain = data[0].data.children[0].data.domain;
                let url = data[0].data.children[0].data.url;
                // console.log(postHint);
                if (postHint === 'rich:video' || url.includes('.webm')) { 
                    // Filter methods. 1. Converts any special characters to their raw form.
                    // 2. Converts the html string to valid JSX that can be rendered
                    let html = null;
                    if (data[0].data.children[0].data.media_embed.content) {
                        html = ReactHtmlParser(decodeHTML(data[0].data.children[0].data.media_embed.content));
                        body = <EmbeddedVideo html={html}/>
                    } else {
                        // If embedded is null
                        body = <EmbeddedLink src={url} />;
                    }
                    bodyType = 'video';
                } else if (postHint === 'image' || domain === 'i.redd.it') {
                    body = <EmbeddedImage src={url}/>;
                    bodyType = 'image';
                } else if (postHint === 'link') {
                    let src = url;
                    if (src.includes('gifv')) {
                        body = <EmbeddedLink src={src.replace('gifv', 'mp4')}/>;
                    } else {
                        body = <EmbeddedLink src={src}/>;
                    }
                    bodyType = 'link';
                } else if (data[0].data.children[0].data.selftext_html !== null || url.includes('/comments')) {
                    body = ReactHtmlParser(decodeHTML(data[0].data.children[0].data.selftext_html));
                    bodyType = 'text';
                } else {
                    // Catch for undefined postHint. So far it's always an image
                    body = <EmbeddedImage src={url}/>;
                    bodyType= 'image';
                }
                // console.log(bodyType)
                this.setState({
                    body: body,
                    bodyType: bodyType,
                    fetchInProgress: false,
                    isBodyLoaded: true
                });
            }
        })
    }

    handleClicked() {
        if (this.state.isPostExpanded) {
            this.props.scrollToTopOfPost(this.props.postId);
        }
        this.props.highlightPost(this.props.postId);
        // Checking so posts don't get loaded more than once
        if (!this.state.isBodyLoaded) {
            this.generatePostBody(this.props.subreddit, this.props.postId);
        }
        if (this.state.isPostExpanded) {
            this.setState({
                isPostExpanded: false,
            });
        } else {
            this.setState({
                isPostExpanded: true,
            });
        }
    }

    render() {
        // Toggles display: block and display: none for the post body
        if (this.state.isPostExpanded) {
            // let text = '•••';
            let text = '-';
            return (
                <div className='expanded-post-container' >
                    <ExpandedPostButton onClick={this.handleClicked} text={text}/>
                    <div className='expanded'>
                        <div className={`post-body-container post-body-container-${this.props.theme}`}>{
                                // Displays loader icon while post body is fetched
                                this.state.fetchInProgress
                                ? <div className='comment-loader-container'><GridLoader loading={true} color={"#44def3"} /></div>
                                :   <div>{this.state.body}</div>
                            }
                        </div>
                        <ExpandedPostButton onClick={this.handleClicked} text={text} isInPost='in-post' />
                    </div>
                </div>
            )
        } else {
            // let text = '•••';
            let text = '+';
            return(
                <div className='expanded-post-container'>
                <ExpandedPostButton onClick={this.handleClicked} text={text}/>
                    <div className='not-expanded'>
                        <div className='post-body-container'>
                        </div>
                    </div>
                </div>
            )
        } 
    } 
}