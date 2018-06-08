import React from 'react';
import { PostAPI } from "../../api/reddit-hots-api";
import { TestExpandedPost } from '../expanded-post-not-used/test-expanded-post';
// var HtmlToReactParser = require('html-to-react').Parser;
// import { Parser } from 'html-to-react';

let parser = new DOMParser();
let decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};
// var htmlToReactParser = new Parser();

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
        let getPost = new PostAPI(this.props.postId);
        let y;
        let x;
        let z;
        getPost.then(data => {
            let post = data[0].data.children[0].data;
            // console.log(post);
            let bodyText = post.selftext_html;
            if (bodyText !== null) {
                x = decodeHTML(bodyText);
                y = parser.parseFromString(x, 'text/html');
                z = [...y];
                console.log(z);
            }
            this.setState({
                body: y,
            });
        })
    }

    handleChecked() {
        this.setState({isPostExpanded: !this.state.isPostExpanded});
    }

    render() {
        // console.log(this.state.isPostExpanded);
        if (this.state.isPostExpanded) {
            return(
                <div className='expanded-post-container'>
                    <TestExpandedPost onChange={this.handleChecked}/>
                    <div className='expanded'>
                    </div>
                </div>
            )
        } else {
            return(
                <div className='expanded-post-container'>
                    <TestExpandedPost onChange={this.handleChecked}/>
                    <div className='not-expanded'>
                    </div>
                </div>
            )
        }
    }
}