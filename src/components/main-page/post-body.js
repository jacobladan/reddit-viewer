import React from 'react';
import { PostAPI } from "../../api/subreddit-api";
import { ExpandedPost } from '../main-page/expand-post';
import { GridLoader } from 'react-spinners';
import ReactHtmlParser from 'react-html-parser';

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
            console.log(data);
            let body, bodyType;
            if (data === undefined) { return }

            if (data[0].data.children[0].data.media !== null) { 
                body = data[0].data.children[0].data.media_embed.content;
                bodyType = 'video';
            } else {
                body = data[0].data.children[0].data.selftext_html;
                bodyType = 'text';
            }

            if (body !== null) {
                // Filter methods. 1. Converts any special characters to their raw form.
                // 2. Converts the html string to valid JSX that can be rendered
                body = ReactHtmlParser(decodeHTML(body));
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
        let videoContainer;
        if (this.state.bodyType === 'video') { videoContainer = {textAlign: 'center'} }
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
                                :   <div style={videoContainer}>{this.state.body}</div>
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