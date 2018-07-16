import React from 'react';
let selectedClasses = 'filter-button selected';
let notSelectedClass = 'filter-button';

let bestButtonStyle, newButtonStyle, controversialButtonStyle, topButtonStyle;

export class CommentsFilter extends React.Component {
    componentWillMount() {
        newButtonStyle = notSelectedClass;
        controversialButtonStyle = notSelectedClass;
        bestButtonStyle = notSelectedClass;
    }

    handleClick(e) {
        let value = e.target.value;
        this.props.handleFilterChange(value);
    }

    render() {
        topButtonStyle = notSelectedClass;
        newButtonStyle = notSelectedClass;
        controversialButtonStyle = notSelectedClass;
        bestButtonStyle = notSelectedClass;

        if (this.props.filter === 'top') {
            topButtonStyle = selectedClasses;
        } else if (this.props.filter === 'new') {
            newButtonStyle = selectedClasses;
        } else if (this.props.filter === 'controversial') {
            controversialButtonStyle = selectedClasses;
        } else if (this.props.filter === 'best') {
            bestButtonStyle = selectedClasses;
        }

        return(
            <div className='comments-filter-container'>
                <button className={`${topButtonStyle} filter-button-${this.props.theme} comments-filter`} 
                        onClick={(e) => this.handleClick(e)} 
                        value='top'>Top</button>
                <button className={`${newButtonStyle} filter-button-${this.props.theme} comments-filter`} 
                        onClick={(e) => this.handleClick(e)} 
                        value='new'>New</button>
                <button className={`${controversialButtonStyle} filter-button-${this.props.theme} comments-filter`} 
                        onClick={(e) => this.handleClick(e)} 
                        value='controversial'>Controversial</button>
                <button className={`${bestButtonStyle} filter-button-${this.props.theme} comments-filter`} 
                        onClick={(e) => this.handleClick(e)} 
                        value='best'>Best</button>
            </div>
        );
    }
}