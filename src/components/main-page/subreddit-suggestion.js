import React from 'react';
import { SubredditSearchAPI } from '../../api/subreddit-api';

export class SubredditSuggestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            numSuggestions: 0
        }
    }

    componentWillReceiveProps() {
        this.getSuggestions(this.props.subreddit);
    }

    componentDidMount() {
        this.getSuggestions(this.props.subreddit);
    }

    handleClick(subreddit) {
        this.props.handleSubredditChange(subreddit);
    }

    getSuggestions(subreddit) {
        const fetch = new SubredditSearchAPI(subreddit);
        fetch.then(data => {
            let suggestions = data.data.children.map( subreddit => {
                    return(
                        <div className='sub-suggestion-container' 
                            key={subreddit.data.id} 
                            onClick={() => this.handleClick(subreddit.data.display_name)}>
                            <p className='sub-suggestion'>{subreddit.data.display_name}</p>
                        </div>
                    );
                }
            );
            this.setState({suggestions: suggestions});
        });
    }

    render() {
        return (
            <div className='suggestions-container'>
                {this.state.suggestions}
            </div>
        );
    }
}