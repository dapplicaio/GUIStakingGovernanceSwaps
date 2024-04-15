import React, { useState, useContext, useEffect } from 'react';
import { UALContext } from 'ual-reactjs-renderer';
import NavbarMenu from '../../components/NavbarMenu/NavbarMenu';
import ToolItem from '../../components/ToolItem/ToolItem';
import { fetchUserAsset, stakeWp } from '../../services/wax.services';
import './Inventory.scss';

function Inventory() {
    const { activeUser } = useContext(UALContext);
    const [activeTab, setActiveTab] = useState('staking');
    const [fetchUserTool, setFetchUserTool] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeUser) {
                    const data = await fetchUserAsset({ activeUser });
                    setFetchUserTool(data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [activeUser]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleClickTool = (item) => {
        const existingIndex = selectedItems.findIndex(selectedItem => selectedItem.asset_id === item.asset_id);
        const updatedItems = [...selectedItems];

        if (existingIndex !== -1) {
            updatedItems.splice(existingIndex, 1);
        } else {
            updatedItems.push(item);
        }

        setSelectedItems(updatedItems);
    };

    const handleStakeItem = () => {
        stakeWp({ activeUser: activeUser, selectedWP: selectedItems })
            .then(() => {
                console.log('Success');
            })
            .catch((error) => {
                console.log(error);
            })
    };

    const handleUnstakeItem = () => {
        console.log('Unstake');
    };

    return (
        <div className="inventory">
            <div className="inventory_container">
                <div className="inventory-center">
                    <NavbarMenu />
                    <div className="inventory-center-block">
                        <div className="inventory-top">
                            <div className="inventory-top-stake-unstake">
                                <p className={activeTab === 'staking' ? 'active' : ''} onClick={() => handleTabClick('staking')}>Staking</p>
                                <p className={activeTab === 'unstaking' ? 'active' : ''} onClick={() => handleTabClick('unstaking')}>Unstaking</p>
                            </div>
                            <div className="inventory-top-stake-block">
                                <div className="stake-block_info">
                                    <p>Selected items: {activeTab === 'staking' ? selectedItems.length : null}</p>
                                </div>
                                {activeTab === 'staking' &&
                                    <button className="stake-block_btn" onClick={handleStakeItem} disabled={!selectedItems.length}>
                                        Stake
                                    </button>
                                }
                                {activeTab === 'unstaking' &&
                                    <button className="stake-block_btn" onClick={handleUnstakeItem} disabled={!selectedItems.length}>
                                        Unstake
                                    </button>
                                }
                            </div>
                        </div>
                        {activeTab === 'staking' &&
                            <div className="inventory-center-block_items_list">
                                {fetchUserTool.map(item => (
                                    <ToolItem key={item.asset_id} item={item} handleClickTool={handleClickTool} selectedItems={selectedItems} />
                                ))}
                            </div>
                        }
                        {activeTab === 'unstaking' &&
                            <div className="inventory-center-block_items_list">
                                {/* {fetchUserTool.map(item => (
                                    <ToolItem key={item.asset_id} item={item} handleClickTool={handleClickTool} selectedItems={selectedItems} />
                                ))} */}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inventory;
