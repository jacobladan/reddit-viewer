import React from 'react';

export class TestExpandedPost extends React.Component {
    render() {
        return <input type="checkbox" onChange={this.props.onChange}/>
    }
}