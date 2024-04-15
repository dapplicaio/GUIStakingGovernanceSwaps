import React from 'react';

import AddIcon from '../../images/plus.png';

import './AddSlot.scss';

function AddSlot() {

    return (
        <div className="workplace-item_block-add">
            <div className="workplace-item">
                <div className="workplace-item-content-add">
                    <div className="asset-img-block-add">
                        <img src={AddIcon} alt="" />
                    </div>
                </div>
            </div>
            <div className="workplace-item_action">
                <button>Unlock</button>
            </div>
        </div>
    );
}

export default AddSlot;
