import React from 'react';
import NavArrows from '../../images/nav-arrows.svg';

export class Navigation extends React.Component {
    
    constructor(props) {
        super(props);
        this.state ={
            pageCount: 1
        }
    }

    handleForwardClick() {
        this.props.onForwardClick();
        this.updatePageNumber('forward');
    }

    handleBackwardClick() {
        if (this.state.pageCount === 1) { return; }
        this.props.onBackwardClick();
        this.updatePageNumber();
    }

    updatePageNumber(direction) {
        if (direction === 'forward') {
            this.setState({pageCount: this.state.pageCount + 1});
        } else {
            this.setState({pageCount: this.state.pageCount - 1});
        }
    }

    resetPageCounter() {
        this.setState({pageCount: 1});
    }

    render() {
        let leftArrowVisible;
        if (this.state.pageCount === 1) {
            leftArrowVisible = {visibility: 'hidden'};
        } else {
            leftArrowVisible = {visibility: 'visible'};
        }
        return (
            <div className='nav-container'>
                <div className='nav-icon-container'>
                    <img src={NavArrows} alt="Previous Page" onClick={() => this.handleBackwardClick()} className='nav-icon left' style={leftArrowVisible}/>
                </div>
                <div className='page-number-container'>
                    <p className='page-number'>{this.state.pageCount}</p>
                </div>
                <div className='nav-icon-container'>
                    <img src={NavArrows} alt="Next Page" onClick={() => this.handleForwardClick()} className='nav-icon right'/>
                </div>
            </div>
        );
    }
}