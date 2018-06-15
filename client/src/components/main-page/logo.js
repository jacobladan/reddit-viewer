import React from 'react';
import LogoImage from '../../images/logo.png';

export class Logo extends React.Component {
    render() {
        return (
            <div className='logo-container'>
                <a  href='https://heroesofthestorm.com' className='logo-link' >
                <img src={LogoImage} alt="Heroes of the Storm" className='logo'/>
                </a>
            </div>
        );
    }
}