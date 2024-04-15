import React, { useContext, useEffect, useState } from 'react';
import { UALContext } from 'ual-reactjs-renderer';
import NavbarMenu from '../../components/NavbarMenu/NavbarMenu';

import { fetchStakedItems } from '../../services/wax.services';
import ToolItem from '../../components/ToolItem/ToolItem';
import './Upgrade.scss';

function Upgrade() {
    const { activeUser } = useContext(UALContext);

    const [selectedItems, setSelectedItems] = useState([]);
    const [stakedItems, setStakedItems] = useState([]);

    useEffect(() => {
        fetchStakedItems({ activeUser })
            .then((data) => {
                setStakedItems(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [activeUser]);

    console.log(stakedItems);

    const handleClickTool = (item) => {
        // Handle click logic here
    };

    return (
        <div className={'upgrade'}>
            <div className="upgrade_container">
                <div className="upgrade-center">
                    <NavbarMenu />
                    <div className="upgrade-center-block">
                        <div className="inventory-center-block">
                            <div className="inventory-top">
                                <div className="inventory-top-stake-unstake">
                                    <select defaultValue={'All resources'}>
                                        <option>All resources</option>
                                        <option>Food</option>
                                        <option>Stone</option>
                                        <option>Wood</option>
                                        <option>Gems</option>
                                    </select>
                                </div>
                                <div className="inventory-top-stake-block">
                                    <div className="stake-block_info">
                                        <p>Price: 1200 *res*</p>
                                    </div>
                                    <button className="stake-block_btn upgrade" onClick={() => null}>
                                        Upgrade
                                    </button>
                                </div>
                            </div>
                            <div className="inventory-center-block_items_list">
                                {stakedItems && stakedItems.staked_items?.map((item, index) => (
                                    <ToolItem key={index} item={item} selectedItems={selectedItems} handleClickTool={handleClickTool} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Upgrade;
