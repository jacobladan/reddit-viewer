import React from 'react';

export class ExpandedPost extends React.Component {
    render() {
        let classes;
        if (!this.props.isInPost) {
            classes = 'expand-post-button';
        } else {
            classes = 'expand-post-button in-post'
        } 
        return <button className={classes} onClick={this.props.onClick}>{this.props.text}</button>;
    }
}