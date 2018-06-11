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
            isPostExpanded: false
        };
        this.handleChecked = this.handleChecked.bind(this);
    }
    
    componentDidMount(){
        this.generatePostBody('heroesofthestorm', this.props.postId)
    }

    generatePostBody(subreddit, Id) {
        let getPost = new PostAPI(subreddit, Id);
        getPost.then(data => {
            let post = data[0].data.children[0].data;
            // console.log(post);
            let bodyText = post.selftext_html;
            if (bodyText !== null) {
                bodyText = ReactHtmlParser(decodeHTML(bodyText));
            }
            this.setState({
                body: bodyText,
            });
        })
    }

    handleChecked() {
        this.setState({isPostExpanded: !this.state.isPostExpanded});
    }

    render() {
        if (this.state.body !== null) {
            if (this.state.isPostExpanded) {
                return(
                    <div className='expanded-post-container'>
                    <ExpandedPost onClick={this.handleChecked}/>
                        <div className='expanded'>
                            <div className='post-body-container'>{this.state.body}</div>
                        </div>
                    </div>
                )
            } else {
                return(
                    <div className='expanded-post-container'>
                    <ExpandedPost onClick={this.handleChecked}/>
                        <div className='not-expanded'>
                            <div className='post-body-container'>{this.state.body}</div>
                        </div>
                    </div>
                )
            } 
        } else {
            return null;
        }    
    }
}