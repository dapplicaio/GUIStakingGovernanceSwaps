import React from 'react';

import './ToolItemAvatar.scss';

function ToolItemAvatar({ item, handleClickAvatar, selectedAvatar }) {
    // const isSelected = selectedAvatar.some(selectedItem => selectedItem.asset_id === item.asset_id);

    return (
        <div className={`item-tool ${item.asset_id === selectedAvatar ? 'active' : ''}`} onClick={() => handleClickAvatar(item.asset_id)}>
            <div className="item-tool_img">
                <img src={`https://atomichub-ipfs.com/ipfs/${item?.data?.img}`} alt="" />
            </div>
            <div className="item-tool_info">
                <span>{item?.data?.name}</span>
                <p>ID {item?.asset_id}</p>
            </div>
        </div>
    );
}


export default ToolItemAvatar;
