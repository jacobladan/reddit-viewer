import React from 'react';

export class SubredditInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: ''
        };
    }

    handleInputChange(e) {
        this.setState({input: e.target.value.replace(/\s/g, '')});
    }

    handleSubmit() {
        if (this.state.input === '') {
            this.props.handleSubredditChange('all');
        } else {
            this.props.handleSubredditChange(this.state.input);
        }
    }

    render() {
        return (
            <div className='subreddit-form-container'>
                <form onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleSubmit();
                    }}>
                    <input 
                        type="text" 
                        className='subreddit-input' 
                        onChange={(e) => this.handleInputChange(e)}
                        placeholder='Enter a Subreddit..'
                        value={this.state.input}/>
                    <input type='submit' className='browse-button' value='Browse' />
                </form>
            </div>
        );
    }
}