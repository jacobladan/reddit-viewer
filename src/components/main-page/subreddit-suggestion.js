import React from 'react';
import { GridLoader } from 'react-spinners';
import { SubredditSearchAPI } from '../../api/subreddit-api';

export class SubredditSuggestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            fetchInProgress: true,
            numSuggestions: 0
        }
    }

    handleClick(subreddit) {
        this.props.handleSubredditChange(subreddit);
    }

    getSuggestions(subreddit) {
        let suggestions, i = 0, rightMargin;
        const fetch = new SubredditSearchAPI(subreddit);
        this.setState({fetchInProgress: true});
        fetch.then(data => {
            suggestions = data.data.children.map( subreddit => {
                    if (i % 2 === 1) { rightMargin = {marginRight: '0%'} }
                    else { rightMargin = {marginRight: '2%'} }
                    i++;
                    return(
                        <div className='sub-suggestion-container' style={rightMargin}
                            key={subreddit.data.id} 
                            onClick={() => this.handleClick(subreddit.data.display_name)}>
                            <p className='sub-suggestion'>{subreddit.data.display_name}</p>
                        </div>
                    );
                }
            );
            this.setState({
                suggestions: suggestions,
                fetchInProgress: false,
                numSuggestions: suggestions.length
            });
        });
    }

    render() {
        if (this.state.numSuggestions === 0) {
            return <p className='no-posts-message'>No suggestions were found</p>;
        } else {
            return (
                this.state.fetchInProgress
                ? <div className='suggestion-loader-container'><GridLoader loading={true} color={"#44def3"}/></div>
                : <div>
                    <p className='no-posts-message'>Maybe you meant one of these...</p>
                    <div className='suggestions-container'>
                        { this.state.suggestions }
                    </div>
                </div>
            );
        }
    }
}