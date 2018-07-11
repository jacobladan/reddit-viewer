import React from 'react';

export class Comment extends React.Component {
    render() {
        let className;
        if (this.props.isParent) {
            className = `parent-comment parent-comment-${this.props.theme}`;
        } 
        if (this.props.isChild) {
            className = `child-comment child-comment-${this.props.theme}`
        } 
        if (this.props.isGrandChild) {
            className = `parent-comment parent-comment-${this.props.theme}`;
        }
        return (
            <div className={className}>
                <div className={`comment-info-container comment-info-container-${this.props.theme}`}>
                    <p className='comment-date'><b>Posted:</b> {this.props.commentInfo.created_utc}</p>
                    <p className='comment-author'>
                        <b>By:</b> 
                        <a className={`comment-author-link comment-author-link-${this.props.theme}`} 
                            href={this.props.commentInfo.authorLink} 
                            target='_blank'>{this.props.commentInfo.author}
                        </a>
                    </p>
                    <p className='comment-points'><b>Points:</b> {this.props.commentInfo.score}</p>
                </div>
                {this.props.commentInfo.body}
                <div className='child-comments-container'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}