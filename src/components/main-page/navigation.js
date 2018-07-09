import React from 'react';
// import NavArrows from '../../images/nav-arrows-white.svg';
import NavArrows from '../../images/nav-arrows-grey.svg';

export class Navigation extends React.Component {
    
    constructor(props) {
        super(props);
        this.state ={
            pageCount: 1,
            atEnd: false
        };
    }

    handleForwardClick() {
        this.props.onForwardClick(this.state.pageCount);
        this.updatePageNumber('forward');
    }

    handleBackwardClick() {
        if (this.state.pageCount === 1) { return; }
        this.props.onBackwardClick(this.state.pageCount);
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
        let leftArrowsVisible;
        let rightArrowsVisible;
        let pageCountVisible;

        if (this.state.pageCount === 1) {
            leftArrowsVisible = {visibility: 'hidden'};
        } else {
            leftArrowsVisible = {visibility: 'visible'};
        }

        if (this.props.atEnd) {
            rightArrowsVisible = {visibility: 'hidden'};
        } else {
            rightArrowsVisible = {visibility: 'visible'};
        }

        if (this.props.subNotFound) {
            pageCountVisible = {visibility: 'hidden'};
        } else {
            pageCountVisible = {visibility: 'visible'};
        }
        return (
            <div className='nav-container'>
                <div className='nav-icon-container'>
                    <img src={NavArrows} alt="Previous Page" onClick={() => this.handleBackwardClick()} className='nav-icon left' style={leftArrowsVisible}/>
                </div>
                <div className='page-number-container'>
                    <p className={`page-number page-number-${this.props.theme}`} style={pageCountVisible}>{this.state.pageCount}</p>
                </div>
                <div className='nav-icon-container'>
                    <img src={NavArrows} alt="Next Page" onClick={() => this.handleForwardClick()} className='nav-icon right' style={rightArrowsVisible}/>
                </div>
            </div>
        );
    }
}