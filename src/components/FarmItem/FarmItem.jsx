import React from 'react';

function FarmItem({image, name, onClick}) {
    return (
        <div className={`${name}-block`}>
            <img src={image} alt="" onClick={onClick} />
        </div>
    );
}

export default FarmItem;