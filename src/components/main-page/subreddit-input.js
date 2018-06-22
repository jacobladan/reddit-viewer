import React from 'react';

export class SubredditInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: ''
        };
        this.input = React.createRef();
        this.subreddit = 'all';
    }

    handleInputChange(e) {
        this.setState({input: e.target.value.replace(/[!@#$%^&*\s()]/g, '')});
    }

    handleSubmit() {
        if (this.state.input === '') {
            return;
        } else {
            // Removing anything that isn't a letter or number
            this.props.handleSubredditChange(this.state.input.replace(/[^a-zA-Z0-9]/,''));
        }
        this.setState({input: ''});
        this.input.current.blur();
    }

    render() {
        // So undefined does not get used as placeholder for input
        if (this.props.subreddit !== undefined) {
            this.subreddit = this.props.subreddit;
        }

        return (
            <div className='subreddit-form-container'>
                <form onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleSubmit();
                    }}>
                    <input 
                        ref={this.input}
                        type="text" 
                        className='subreddit-input' 
                        onChange={(e) => this.handleInputChange(e)}
                        placeholder={'/r/' + this.subreddit}
                        value={this.state.input}/>
                    <input type='submit' className='browse-button' value='Browse' />
                </form>
            </div>
        );
    }
}