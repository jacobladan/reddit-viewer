import React from 'react';
import Switch from "react-switch";
import { Animated } from "react-animated-css";
import SettingsCogBlack from '../../images/settings-cog-black.svg';
import SettingsCogGray from '../../images/settings-cog-gray.svg';
import { SubredditInput } from './subreddit-input';

export class SettingsMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuIsVisible: false,
        };
        this.onColor = '#5adaff';
        this.settingsCog = SettingsCogBlack;
    }

    handleCogClick() {
        this.setState({menuIsVisible: !this.state.menuIsVisible});
    }

    render() {
        if (this.props.theme === 'dark') {
            this.onColor = '#a3cfdd';
            this.settingsCog = SettingsCogGray;
        } else {
            this.onColor = '#5adaff';
            this.settingsCog = SettingsCogBlack;
        }
        return (
            <div className='settings-container'>
                <img 
                src={this.settingsCog} 
                alt="settings" 
                className='settings-cog hvr-grow'
                onClick={() => this.handleCogClick()}
                />
                <Animated animationIn='fadeIn' isVisible={this.state.menuIsVisible} animateOnMount={false} style={{animationDuration: '.3s'}}>
                    <div className={`settings-menu settings-menu-${this.props.theme}`}>
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
                                onColor={this.onColor}
                                checked={this.props.nsfwFilter}
                                onChange={() => this.props.toggleNSFW()}/>
                            </div>
                        </div>
                        <div className='menu-item-container'>
                            <label className='menu-item-label'>Dark Theme</label>
                            <div className='toggle-switch-container'>
                                <Switch 
                                className='toggle-switch'
                                width={40}
                                height={20}
                                onColor={this.onColor}
                                checked={this.props.isDarkTheme}
                                onChange={() => this.props.toggleDarkTheme(this.props.isDarkTheme)}/>
                            </div>
                        </div>
                    </div>
                </Animated>
            </div>
        );
    }
}