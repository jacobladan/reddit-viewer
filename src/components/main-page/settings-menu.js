import React from 'react';
import Switch from "react-switch";
import { Animated } from "react-animated-css";
import SettingsCog from '../../images/settings-cog.svg';
import { SubredditInput } from './subreddit-input';

export class SettingsMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuIsOpen: false,
            nsfwFilter: true,
        };
        this.settingsCog = React.createRef();
    }

    handleClick() {
        this.setState({menuIsOpen: !this.state.menuIsOpen});
    }

    render() {
        return (
            <div className='settings-container'>
                <img 
                ref={this.settingsCog}
                src={SettingsCog} 
                alt="settings" 
                className='settings-cog hvr-grow' 
                onClick={() => this.handleClick()}/>
                <Animated animationIn='fadeIn' isVisible={this.state.menuIsOpen} animateOnMount={false} style={{animationDuration: '.3s'}}>
                    <div className='settings-menu'>
                        <SubredditInput className='subreddit-form-container-mobile' handleSubredditChange={this.props.handleSubredditChange} />
                        <div className='menu-item-container'>
                            <label className='menu-item-label'>NSFW Filter</label>
                            <div className='toggle-switch-container'>
                                <Switch 
                                className='toggle-switch'
                                width={40}
                                height={20}
                                onColor='#5adaff'
                                checked={this.props.nsfwFilter}
                                onChange={() => this.props.toggleNSFW()}/>
                            </div>
                        </div>
                    </div>
                </Animated>
            </div>
        );
    }
}