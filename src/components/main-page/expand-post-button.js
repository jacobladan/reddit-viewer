import React from 'react';

export class ExpandedPostButton extends React.Component {
    render() {
        // Work around to add additional class to a button if parent needs
        let buttonClasses = `expand-post-button ${this.props.isInPost}`;

        return <button className={buttonClasses} onClick={this.props.onClick}>{this.props.text}</button>;
    }
}