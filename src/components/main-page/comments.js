import React from 'react';
import { PostAPI } from '../../api/subreddit-api';
import { GridLoader } from 'react-spinners';
import ReactHtmlParser from 'react-html-parser';

let decodeHTML = function (html) {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

export class Comments  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            fetchInProgress: false,
        };
    }
    // To add to comments:
    // points, author, timestamp(use postinfo date converter/move to seperate comp), expand children button
    generateComments(subreddit, id) {
        const fetch = new PostAPI(subreddit, id);
        this.setState({fetchInProgress: true});
        fetch.then(data => {
            let comments = data[1].data.children.map(comment => {
                console.log(comment.data);
                let commentBody = ReactHtmlParser(decodeHTML(comment.data.body_html));
                return (
                    <div key={comment.data.id} className='parent-comment'>
                        {commentBody}
                    </div>
                );
            });
            this.setState({comments: comments, fetchInProgress: false});
        });
    }
    render() {
        return (
            this.state.fetchInProgress
            ? <div className='comment-loader-container'><GridLoader loading={true} color={"#44def3"} /></div>
            :<div className='post-comments-container'>
            {this.state.comments}
            </div>
        );
    }
}