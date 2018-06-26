import React from 'react';
import { PostAPI } from "../../api/subreddit-api";
import { ExpandedPost } from '../main-page/expand-post';
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

            let body, bodyType;
            let postHint = data[0].data.children[0].data.post_hint;
            // console.log(postHint);
            if (postHint === 'rich:video') { 
                // Filter methods. 1. Converts any special characters to their raw form.
                // 2. Converts the html string to valid JSX that can be rendered
                let html = ReactHtmlParser(decodeHTML(data[0].data.children[0].data.media_embed.content));
                body = <EmbeddedVideo html={html}/>
                bodyType = 'video';
            } else if (postHint === 'image') {
                body = <EmbeddedImage src={data[0].data.children[0].data.url}/>;
                bodyType = 'image';
            } else if (postHint === 'link') {
                let src = data[0].data.children[0].data.url;
                body = <EmbeddedLink src={src.replace('gifv', 'mp4')}/>
                console.log(data[0].data.children[0].data.url);
                bodyType = 'link';
            } else if (data[0].data.children[0].data.selftext_html !== null) {
                body = ReactHtmlParser(decodeHTML(data[0].data.children[0].data.selftext_html));
                bodyType = 'text';
            }
            
            this.setState({
                body: body,
                bodyType: bodyType,
                fetchInProgress: false,
                isBodyLoaded: true
            });
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
            let text = '•••';
            return (
                <div className='expanded-post-container' >
                    <ExpandedPost onClick={this.handleClicked} text={text}/>
                    <div className='expanded'>
                        <div className='post-body-container' >{
                                // Displays loader icon while post body is fetched
                                this.state.fetchInProgress
                                ? <div className='comment-loader-container'><GridLoader loading={true} color={"#44def3"} /></div>
                                :   <div>{this.state.body}</div>
                            }
                        </div>
                        <ExpandedPost onClick={this.handleClicked} text={text} isInPost='in-post' />
                    </div>
                </div>
            )
        } else {
            let text = '•••';
            return(
                <div className='expanded-post-container'>
                <ExpandedPost onClick={this.handleClicked} text={text}/>
                    <div className='not-expanded'>
                        <div className='post-body-container'>
                        </div>
                    </div>
                </div>
            )
        } 
    } 
}