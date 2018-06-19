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
            subreddit: 'all',
            comments: [],
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
            let bodyText = data[0].data.children[0].data.selftext_html;
            if (data === undefined) { return }
            if (bodyText !== null) {
                // Filter methods. 1. Converts any special characters to their raw form.
                // 2. Converts the html string to valid JSX that can be rendered
                bodyText = ReactHtmlParser(decodeHTML(bodyText));
            }
            this.setState({
                body: bodyText,
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
            // let text = '▲';
            // let text = '-';
            // let text = 'CLOSE';
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
            // let text = '▼';
            // let text = '+';
            // let text = 'EXPAND';
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