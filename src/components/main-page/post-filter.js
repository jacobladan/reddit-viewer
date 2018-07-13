import React from 'react';
import { TopFilter } from './top-filter';

let selectedClasses = 'filter-button selected';
let notSelectedClass = 'filter-button';
let hotButtonStyle, newButtonStyle, risingButtonStyle, topButtonStyle;

export class PostFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hotSelected: true,
            newSelected: false,
            risingSelected: false,
            topSelected: false
        };
    }
    // Setting default styling to 'hot' button
    componentWillMount() {
        newButtonStyle = notSelectedClass;
        risingButtonStyle = notSelectedClass;
        topButtonStyle = notSelectedClass;
    }
    // When filter is changed, this resets all of the buttons to 'not selected'
    componentWillUpdate() {
        hotButtonStyle = notSelectedClass;
        newButtonStyle = notSelectedClass;
        risingButtonStyle = notSelectedClass;
        topButtonStyle = notSelectedClass;
    }
    // Sets selected class for which ever button has been clicked
    handleClick(e) {
        let value = e.target.value;
        this.setFilter(value);
        this.props.handleFilterChange(value);
    }

    setFilter(filter) {
        if (filter === 'hot') {
            this.setState({
                hotSelected: true,
                newSelected: false,
                risingSelected: false,
                topSelected: false
            });
        } else if (filter === 'new') {
            this.setState({
                hotSelected: false,
                newSelected: true,
                risingSelected: false,
                topSelected: false
            });
        } else if(filter === 'rising') {
            this.setState({
                hotSelected: false,
                newSelected: false,
                risingSelected: true,
                topSelected: false
            });        
        } else if(filter === 'top') {
            this.setState({
                hotSelected: false,
                newSelected: false,
                risingSelected: false,
                topSelected: true
            });        
        }
    }

    render() {
        // Sets which ever button should have selected class before rendering
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
                <button className={`${hotButtonStyle} filter-button-${this.props.theme}`} 
                        onClick={(e) => this.handleClick(e)} 
                        value='hot'>Hot</button>
                <button className={`${newButtonStyle} filter-button-${this.props.theme}`} 
                        onClick={(e) => this.handleClick(e)} 
                        value='new'>New</button>
                <button className={`${risingButtonStyle} filter-button-${this.props.theme}`} 
                        onClick={(e) => this.handleClick(e)} 
                        value='rising'>Rising</button>
                <button className={`${topButtonStyle} filter-button-${this.props.theme}`} 
                        onClick={(e) => this.handleClick(e)} 
                        value='top'>Top</button>
                <TopFilter isTopSelected={this.state.topSelected} 
                        handleSortByChange={this.props.handleSortByChange} 
                        sortBy={this.props.sortBy}
                        theme={this.props.theme}/>
            </div>
        );
    }
}