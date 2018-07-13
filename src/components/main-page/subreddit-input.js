import React from 'react';
import { defaultSubreddit } from '../../api/subreddit-api';

export class SubredditInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            input: '',
            rStyle: {},
            valueStyle: {},
        };
        this.input = React.createRef();
        this.subreddit = defaultSubreddit;
    }

    componentWillMount() {
        this.setState({input: this.props.subreddit});
    }

    componentDidMount() {
        if (this.props.theme === 'dark') {
            this.setState({rStyle: {color: 'rgb(107, 107, 107)'}, valueStyle: {color: 'rgb(107, 107, 107)'}});
        } else {
            this.setState({rStyle: {color: 'rgb(138, 138, 138)'}, valueStyle: {color: 'rgb(138, 138, 138)'}});
        }
    }

    handleInputChange(e) {
        this.setState({input: e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()});
    }

    handleSubmit() {
        if (this.state.input === '') {
            return;
        } else {
            // Removing anything that isn't a letter, number, or underscore
            this.props.handleSubredditChange(this.state.input.replace(/[^a-zA-Z0-9_]/,''));
        }
        this.input.current.blur();
    }

    handleFocus() {
        if (this.props.theme === 'dark') {
            this.setState({rStyle: {color: 'white'}, valueStyle: {color: 'white'}});
        } else {
            this.setState({rStyle: {color: 'black'}, valueStyle: {color: 'black'}});
        }
    }

    handleBlur() {
        if (this.props.theme === 'dark') {
            this.setState({rStyle: {color: 'rgb(107, 107, 107)'}, valueStyle: {color: 'rgb(107, 107, 107)'}});
        } else {
            this.setState({rStyle: {color: 'rgb(138, 138, 138)'}, valueStyle: {color: 'rgb(138, 138, 138)'}});
        }
    }

    render() {
        // So undefined does not get used as placeholder for input
        if (this.props.subreddit !== undefined) {
            this.subreddit = this.props.subreddit;
        }
        return (
            <div className={this.props.className}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleSubmit();
                }}>
                    <p className={`floating-r floating-r-${this.props.theme}`} style={this.state.rStyle}><b>/r/</b></p>
                    <input 
                        ref={this.input}
                        type="text" 
                        className={`subreddit-input subreddit-input-${this.props.theme}`}
                        style={this.state.valueStyle}
                        onChange={(e) => this.handleInputChange(e)}
                        value={this.state.input}
                        onFocus={() => this.handleFocus()}
                        onBlur={() => this.handleBlur()}/>
                    <input type='submit' className={`browse-button browse-button-${this.props.theme}`} value='Browse' />
                </form>
            </div>
        );
    }
}