import React from 'react';
import { defaultSubreddit } from '../../api/subreddit-api';

export class SubTitle extends React.Component { 
    constructor(props) {
        super(props);
        this.subreddit = defaultSubreddit;
    }
    render() {
        // So the first render of title does not show undefined
        if (this.props.subreddit !== undefined) {
            this.subreddit = this.props.subreddit;
        }
        return (
            <div className='sub-title-container'>
                <a className='sub-title' href={'https://www.reddit.com/r/' + this.props.subreddit} target='_blank'>
                    {'/r/' + this.subreddit}
                </a>
            </div>
        );
    }
}