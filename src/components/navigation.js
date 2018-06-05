import React from 'react';

export class Navigation extends React.Component {
    render() {
        return (
            <div>
                <button onClick={this.props.onBackwardClick}>Last Page</button>
                <button onClick={this.props.onForwardClick}>Next Page</button>
            </div>
        );
    }
}