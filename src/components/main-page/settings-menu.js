import React from 'react';
import Switch from "react-switch";
import { Animated } from "react-animated-css";
import SettingsCog from '../../images/settings-cog.svg';
import { SubredditInput } from './subreddit-input';

export class SettingsMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nsfwFilter: true,
        };
    }

    handleMouseEnter(e) {
        this.props.openSettingsMenu(e);
    }

    handleMouseLeave() {
        this.props.closeSettingsMenu();
    }

    render() {
        return (
            <div className='settings-container'>
                <img 
                src={SettingsCog} 
                alt="settings" 
                className='settings-cog hvr-grow'
                onMouseEnter={(e) => this.handleMouseEnter(e)}
                />
                <Animated animationIn='fadeIn' isVisible={this.props.menuIsOpen} animateOnMount={false} style={{animationDuration: '.3s'}}>
                    <div className='settings-menu' onMouseLeave={(e) => this.handleMouseLeave(e)}>
                        <SubredditInput className='subreddit-form-container-mobile' 
                                        handleSubredditChange={this.props.handleSubredditChange}
                                        subreddit={''}/>
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