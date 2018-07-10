import React from 'react';

export class Comments  extends React.Component {
    // To add to comments:
    // points, author, timestamp(use postinfo date converter/move to seperate comp), expand children button
    
    render() {
        return (
            <div className='post-comments-container'>
                {this.props.comments}
            </div>
        );
    }
}