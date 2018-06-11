import React from 'react';
import { PostAPI } from "../../api/subreddit-api";
import { ExpandedPost } from '../main-page/expand-post';
import { GridLoader } from 'react-spinners';
import ReactHtmlParser from 'react-html-parser';
import '../../styles/comment-loader-styles.css';

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
            comments: [],
            isPostExpanded: false,
            expandButtonText: 'EXPAND',
            fetchInProgress: true,
            isBodyLoaded: false
        };
        this.handleClicked = this.handleClicked.bind(this);
    }

    generatePostBody(subreddit, Id) {
        this.setState({fetchInProgress: true});
        const getPost = new PostAPI(subreddit, Id);
        getPost.then(data => {
            if (data === undefined) { return }
            let bodyText = data[0].data.children[0].data.selftext_html;
            if (bodyText !== null) {
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
        if (!this.state.isBodyLoaded) {
            this.generatePostBody('heroesofthestorm', this.props.postId);
        }
        if (this.state.isPostExpanded) {
            this.setState({
                isPostExpanded: false,
                expandButtonText: 'CLOSE'
            });
        } else {
            this.setState({
                isPostExpanded: true,
                expandButtonText: 'EXPAND'
            });
        }
    }

    render() {
        if (this.state.isPostExpanded) {
            let text = 'CLOSE';
            return (
                <div className='expanded-post-container'>
                    <ExpandedPost onClick={this.handleClicked} text={text}/>
                    <div className='expanded'>
                        <div className='post-body-container'>{
                                this.state.fetchInProgress
                                ? <GridLoader loading={true} color={"#44def3"} />
                                : this.state.body
                            }
                            <ExpandedPost onClick={this.handleClicked} text={text} isInPost={true}/>
                        </div>
                    </div>
                </div>
            )
        } else {
            let text = 'EXPAND';
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