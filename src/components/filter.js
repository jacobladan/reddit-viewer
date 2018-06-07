import React from 'react';

let topSelectedClasses = ['filter-button'];
let risingSelectedClasses = ['filter-button'];
let newSelectedClasses = ['filter-button'];
let hotSelectedClasses = ['filter-button'];

export class Filter extends React.Component {

    componentWillMount() {
        hotSelectedClasses.push('selected');
        hotSelectedClasses.join(' ');
    }

    handleClick(e) {
        let value = e.target.value;
        topSelectedClasses = ['filter-button'];
        risingSelectedClasses = ['filter-button'];
        newSelectedClasses = ['filter-button'];
        hotSelectedClasses = ['filter-button'];

        if (value === 'hot') {
            hotSelectedClasses.push('selected');
            this.forceUpdate();
        } else if (value === 'new') {
            newSelectedClasses.push('selected');
            this.forceUpdate();
        } else if(value === 'rising') {
            risingSelectedClasses.push('selected');
            this.forceUpdate();
        } else if(value === 'top') {
            topSelectedClasses.push('selected');
            this.forceUpdate();
        }
    }

    render() {
        return(
            <div className='filter-container'>
                <button className={hotSelectedClasses.join(' ')} onClick={(e) => this.handleClick(e)} value='hot'>Hot</button>
                <button className={newSelectedClasses.join(' ')} onClick={(e) => this.handleClick(e)} value='new'>New</button>
                <button className={risingSelectedClasses.join(' ')} onClick={(e) => this.handleClick(e)} value='rising'>Rising</button>
                <button className={topSelectedClasses.join(' ')} onClick={(e) => this.handleClick(e)} value='top'>Top</button>
            </div>
        );
    }
}