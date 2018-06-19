import React from 'react';

export class SubredditInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: ''
        };
        this.input = React.createRef();
    }

    handleInputChange(e) {
        this.setState({input: e.target.value.replace(/\s/g, '')});
    }

    handleSubmit() {
        if (this.state.input === '') {
            return;
        } else {
            this.props.handleSubredditChange(this.state.input);
        }
        this.setState({input: ''});
        this.input.current.blur();
    }

    render() {
        // So undefined does not get used as placeholder for input
        let placeholder;
        if (typeof(this.props.subreddit) === 'undefined') { placeholder = '' }
        else { placeholder = this.props.subreddit }

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
                        placeholder={'/r/' + placeholder}
                        value={this.state.input}/>
                    <input type='submit' className='browse-button' value='Browse' />
                </form>
            </div>
        );
    }
}