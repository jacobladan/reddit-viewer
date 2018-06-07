import React from 'react';
import { TopFilter } from './top-filter';

let selectedClasses = 'filter-button selected';
let notSelectedClass = 'filter-button';
let hotButtonStyle, newButtonStyle, risingButtonStyle, topButtonStyle;

export class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hotSelected: true,
            newSelected: false,
            risingSelected: false,
            topSelected: false
        };
    }

    componentWillMount() {
        newButtonStyle = notSelectedClass;
        risingButtonStyle = notSelectedClass;
        topButtonStyle = notSelectedClass;
    }

    componentWillUpdate() {
        hotButtonStyle = notSelectedClass;
        newButtonStyle = notSelectedClass;
        risingButtonStyle = notSelectedClass;
        topButtonStyle = notSelectedClass;
    }

    handleClick(e) {
        let value = e.target.value;

        if (value === 'hot') {
            this.setState({
                hotSelected: true,
                newSelected: false,
                risingSelected: false,
                topSelected: false
            });
        } else if (value === 'new') {
            this.setState({
                hotSelected: false,
                newSelected: true,
                risingSelected: false,
                topSelected: false
            });
        } else if(value === 'rising') {
            this.setState({
                hotSelected: false,
                newSelected: false,
                risingSelected: true,
                topSelected: false
            });        
        } else if(value === 'top') {
                this.setState({
                    hotSelected: false,
                    newSelected: false,
                    risingSelected: false,
                    topSelected: true
                });        
        }
        this.props.handleFilterChange(value);
    }

    render() {
        if (this.state.hotSelected) {
            hotButtonStyle = selectedClasses;
        } else if (this.state.newSelected) {
            newButtonStyle = selectedClasses;
        } else if (this.state.risingSelected) {
            risingButtonStyle = selectedClasses;
        } else if (this.state.topSelected) {
            topButtonStyle = selectedClasses;
        }
        return(
            <div className='filter-container'>
                <button className={hotButtonStyle} onClick={(e) => this.handleClick(e)} value='hot' ref='hotButton'>Hot</button>
                <button className={newButtonStyle} onClick={(e) => this.handleClick(e)} value='new'>New</button>
                <button className={risingButtonStyle} onClick={(e) => this.handleClick(e)} value='rising'>Rising</button>
                <button className={topButtonStyle} onClick={(e) => this.handleClick(e)} value='top'>Top</button>
                <TopFilter isTopSelected={this.state.topSelected} handleSortByChange={this.props.handleSortByChange}/>
            </div>
        );
    }
}