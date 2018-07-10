import React from 'react';
import { Comments } from './comments';

export class CommentsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.comments = React.createRef();
    }
    generateComments(subreddit, id) {
        this.comments.current.generateComments(subreddit, id);
    }
    render() {
        return (
            <div className='comments-expanded-container' style={this.props.display}>
                <Comments ref={this.comments}/>
            </div>
        );
    }
}