import React, {useContext, useState} from 'react';
import { UALContext } from 'ual-reactjs-renderer';

import ToolItemAvatar from '../ToolItemAvatar/ToolItemAvatar';

import './PopupAvatar.scss';
import { setAvatar } from '../../services/wax.services';


function PopupAvatar({ onClose, userAvatars, setShowPopup }) {
    const { activeUser } = useContext(UALContext);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    
    const handleClickAvatar = (item) => {
        setSelectedAvatar(item);
    }

    
    const handleSetAvatar = () => {
        setAvatar({activeUser, avatarId: selectedAvatar})
            .then(() => {
                console.log('Successfuly');

                setShowPopup(false);

                
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <>
            <div className="overlay" onClick={onClose}></div>
            <div className="popup">
                <div className="inventory-center-block">
                    <div className="inventory-top">
                        <div className="inventory-top-stake-unstake">
                            <p className={'cansel'} onClick={onClose}>Cancel</p>
                        </div>
                        <div className="inventory-top-stake-block">
                            <div className="stake-block_info">

                            </div>
                                <button className="stake-block_btn" onClick={() => handleSetAvatar()}>
                                    Set Avatar
                                </button>
                        </div>
                    </div>
                        <div className="inventory-center-block_items_list">
                            {userAvatars.map(item => (
                                <ToolItemAvatar item={item} handleClickAvatar={handleClickAvatar} selectedAvatar={selectedAvatar}  />
                            ))}
                        </div>
                </div>
            </div>
        </>
    );
}

export default PopupAvatar;
