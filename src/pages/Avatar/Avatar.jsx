import React, { useContext, useState, useEffect } from 'react';
import { UALContext } from 'ual-reactjs-renderer';
import NavbarMenu from '../../components/NavbarMenu/NavbarMenu';

import HeroIcon from '../../images/Hero_test.png';
import PlusIcon from '../../images/plus.png';

import PopupAvatar from '../../components/PopupAvatar/PopupAvatar';
import { fetchAvatars, fetchUserAvatar, setAvatar } from '../../services/wax.services';


import './Avatar.scss';


function Avatar() {
    const { activeUser } = useContext(UALContext);
    const [showPopup, setShowPopup] = useState(false);
    const [userAvatars, setUserAvatars] = useState([]);
    const [myAvatar, setMyAvatar] = useState([]);


    useEffect(() => {
        const fetchUserAvatar = async () => {
            try {
                if (activeUser) {
                    const data = await fetchAvatars({ activeUser });
                    setMyAvatar(data.equipment);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserAvatar();
    }, [activeUser]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeUser) {
                    const data = await fetchUserAvatar({ activeUser });
                    setUserAvatars(data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [activeUser]);


    const togglePopup = () => {
        setShowPopup(!showPopup);
    };


    
    console.log(myAvatar);

    return (
        <div className={'avatar'}>
            <div className="avatar_container">
                <div className="avatar-center">
                    <NavbarMenu />
                    <div className="avatar-center-block">
                        {!myAvatar ?
                            <div className="container">
                                <div className="avatar-left">
                                    <div className="title">
                                        <h3>Joun Smith</h3>
                                        <p>Adventurer from far away</p>
                                    </div>
                                    <div className="avatar-img">
                                        <img src={HeroIcon} alt="man" />
                                    </div>
                                    <div className="characteristic">
                                        <div className="characteristic-left">
                                            <div className='char-item'><p>Bravery:</p><span>0</span></div>
                                            <div className='char-item'><p>Economic:</p><span>0</span></div>
                                            <div className='char-item'><p>Vitality:</p><span>0</span></div>
                                        </div>
                                        <div className="characteristic-right">
                                            <div className='char-item'><p>Diplomacy:</p><span>0</span></div>
                                            <div className='char-item'><p>Productivity:</p><span>0</span></div>
                                        </div>
                                    </div>
                                    <div className="avatar-change">
                                        <button onClick={() => setShowPopup(true)}>Set new avatar</button>
                                    </div>
                                </div>
                                <div className="avatar-right">
                                    <div className="avatar-right-item unequip">
                                        <div className="item-block">
                                            <div className="item-block-img">
                                                <img src={PlusIcon} alt="" />
                                            </div>
                                            <div className="item-block-action">
                                                <button className='unequip'>Uneqip</button>
                                            </div>
                                        </div>
                                        <div className="item-info">
                                            <div className="item-info-name">
                                                <p>Crown</p>
                                            </div>
                                            <div className="item-info-char">
                                                <div>
                                                    <p>Bravery: +3</p>
                                                </div>
                                                <div>
                                                    <p>Economic: +3</p>
                                                </div>
                                                <div>
                                                    <p>Vitality: +3</p>
                                                </div>
                                                <div>
                                                    <p>Diplomacy: +3</p>
                                                </div>
                                                <div>
                                                    <p>Productivity: +3</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="avatar-right-item equip">
                                        <div className="item-block">
                                            <div className="item-block-img">
                                                <img src={PlusIcon} alt="" />
                                            </div>
                                            <div className="item-block-action">
                                                <button className='equip'>Equip</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="avatar-right-item equip">
                                        <div className="item-block">
                                            <div className="item-block-img">
                                                <img src={PlusIcon} alt="" />
                                            </div>
                                            <div className="item-block-action">
                                                <button className='equip'>Equip</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="avatar-right-item equip">
                                        <div className="item-block">
                                            <div className="item-block-img">
                                                <img src={PlusIcon} alt="" />
                                            </div>
                                            <div className="item-block-action">
                                                <button className='equip'>Equip</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="add-avatar-block-action">
                                <button className='equip' onClick={() => togglePopup()}>Set avatar</button>
                            </div>
                        }

                    </div>
                </div>
            </div>
            {showPopup && <PopupAvatar onClose={togglePopup} userAvatars={userAvatars} setShowPopup={setShowPopup} />}
        </div>
    );
}

export default Avatar;
