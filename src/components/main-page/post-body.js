import React from 'react';
import { PostAPI } from "../../api/subreddit-api";
import { ExpandedPost } from '../main-page/expand-post';
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
            comments: [],
            isPostExpanded: false,
            expandButtonText: 'EXPAND'
        };
        this.handleChecked = this.handleChecked.bind(this);
    }
    
    componentDidMount(){
        this.generatePostBody('heroesofthestorm', this.props.postId)
    }

    generatePostBody(subreddit, Id) {
        let getPost = new PostAPI(subreddit, Id);
        getPost.then(data => {
            if (data === undefined) { return }
            let bodyText = data[0].data.children[0].data.selftext_html;
            if (bodyText !== null) {
                bodyText = ReactHtmlParser(decodeHTML(bodyText));
            }
            this.setState({
                body: bodyText,
            });
        })
    }

    handleChecked() {
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
        if (this.state.body !== null) {
            if (this.state.isPostExpanded) {
                let text = 'CLOSE';
                return(
                    <div className='expanded-post-container'>
                    <ExpandedPost onClick={this.handleChecked} text={text}/>
                        <div className='expanded'>
                            <div className='post-body-container'>
                                {this.state.body}
                                <ExpandedPost onClick={this.handleChecked} text={text} isInPost={true}/>
                            </div>
                        </div>
                    </div>
                )
            } else {
                let text = 'EXPAND';
                return(
                    <div className='expanded-post-container'>
                    <ExpandedPost onClick={this.handleChecked} text={text}/>
                        <div className='not-expanded'>
                            <div className='post-body-container'>
                                {this.state.body}
                                <ExpandedPost onClick={this.handleChecked} text={text} isInPost={true}/>
                            </div>
                        </div>
                    </div>
                )
            } 
        } else {
            return null;
        }    
    }
}