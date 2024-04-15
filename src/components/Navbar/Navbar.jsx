import React, { useContext, useEffect, useState } from 'react';
import { UALContext } from 'ual-reactjs-renderer';

import { fetchResources } from '../../services/wax.services';

import StoneImg from '../../images/stone-icon.png';
import WoodImg from '../../images/wood-icon.png';
import AppleImg from '../../images/food-icon.png';
import DiamondImg from '../../images/gems-icon.png';


import UserImg from '../../images/user.png';
import HeroImg from '../../images/hero.png';

import './Navbar.scss';

function Navbar() {
    const { activeUser } = useContext(UALContext);
    const [resources, setResources] = useState([])


    useEffect(() => {
        if (activeUser) {
            fetchResources({ activeUser })
            .then((data) => {
                setResources(data);
            })
            .catch((error) => {
                console.error(error);
            })
        }
    }, [activeUser])

    return (
        <nav className="nav">
            <div className="logo">
                <p className='logo-p'>FarmingKingdom</p>
            </div>
            <div className="farm-items">
                <div className="farm-items-left">
                    {resources.slice(0, 2).map(resource => (
                        <div className={resource.resource_name} key={resource.resource_name}>
                            <img src={resource.resource_name === 'stone' ? StoneImg : WoodImg} alt={resource.resource_name} />
                            <p>{resource.amount}</p>
                        </div>
                    ))}
                </div>
                <div className="hero-img">
                    <img src={HeroImg} alt="hero" />
                </div>
                <div className="farm-items-right">
                    {resources.slice(2).map(resource => (
                        <div className={resource.resource_name} key={resource.resource_name}>
                            <img src={resource.resource_name === 'food' ? AppleImg : DiamondImg} alt={resource.resource_name} />
                            <p>{resource.amount}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="user">
                <img src={UserImg} alt="user" />
                <p>{activeUser?.accountName ?? 'test.wax'}</p>
            </div>
        </nav>
    );
}

export default Navbar;