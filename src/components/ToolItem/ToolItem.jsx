import React from 'react';

import './ToolItem.scss';

function ToolItem({ item, handleClickTool, selectedItems }) {
    const isSelected = selectedItems.some(selectedItem => selectedItem.asset_id === item.asset_id);

    return (
        <div className={`item-tool ${isSelected ? 'active' : ''}`} onClick={() => handleClickTool(item)}>
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


export default ToolItem;
