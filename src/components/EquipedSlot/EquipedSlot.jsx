import React from 'react';


import './EquipedSlot.scss';

function EquipedSlot({item}) {

    return (
        <div className="workplace-item_block-equiped">
            <div className="workplace-item">
                <div className="workplace-item-content">
                    <div className="asset-name">
                        <h4>{item?.data?.name}</h4>
                    </div>
                    <div className="asset-img-block">
                        <img src={`https://atomichub-ipfs.com/ipfs/${item?.data?.img}`} alt="" />
                    </div>
                    <div className="asset-lvl"></div>
                    <div className="asset-produces-info">
                        <span>Produces:</span>
                        <p>1 food/hour</p>
                    </div>
                </div>
            </div>
            <div className="workplace-item_action">
                <button>Unequip</button>
            </div>
        </div>
    );
}

export default EquipedSlot;
