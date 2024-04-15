import React, {useState, useEffect, useContext} from 'react';
import { UALContext } from 'ual-reactjs-renderer';
import { blend, fetchUserToolAsset } from '../../services/wax.services';


import ToolItem from '../ToolItem/ToolItem';

import './PopupBlend.scss';

function PopupBlend({ onClose, selectedBlend, selectedItemsForBland, setSelectedItemsForBland }) {
    const { activeUser } = useContext(UALContext);

    const [fetchUserTool, setFetchUserTool] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeUser) {
                    const data = await fetchUserToolAsset({ activeUser });
                    setFetchUserTool(data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [activeUser]);

    const handleClickTool = (item) => {
        if (selectedItemsForBland.length < 2) {
            const index = selectedItemsForBland.findIndex(selectedItem => selectedItem.asset_id === item.asset_id);
    
            if (index !== -1) {
                setSelectedItemsForBland(prevItems => prevItems.filter(selectedItem => selectedItem.asset_id !== item.asset_id));
            } else {
                setSelectedItemsForBland(prevItems => [...prevItems, item]);
            }
        }
    }

    const handleBlend = () => {
        if (activeUser) {
            blend({activeUser, componentIds: selectedItemsForBland, id: selectedBlend.blend_id})
            .then(() => {
                console.log('Successfuly');

                setTimeout(async () => {
                        try {
                            if (activeUser) {
                                const data = await fetchUserToolAsset({ activeUser });
                                setFetchUserTool(data);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                }, 2000);
            })
            .catch((error) => {
                console.error(error);
            })
        }
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
                                <div className='recipe'>
                                    <p>Recipe:</p>
                                    <div className="r-1">
                                        <div className={'r-1_border selected'}></div>
                                        <p>{selectedBlend.blend_components[0].immutable_data.name}</p>
                                    </div>
                                    <span>+</span>
                                    <div className="r-2">
                                        <div className={'r-2_border'}></div>
                                        <p>{selectedBlend.blend_components[1].immutable_data.name}</p>
                                    </div>
                                </div>
                            </div>
                                <button className="stake-block_btn" onClick={() => handleBlend()}>
                                    Blend
                                </button>
                        </div>
                    </div>
                        <div className="inventory-center-block_items_list">
                            {fetchUserTool.map(item => (
                                <ToolItem key={item.asset_id} item={item} selectedItems={selectedItemsForBland} handleClickTool={handleClickTool} />
                            ))}
                        </div>
                </div>
            </div>
        </>
    );
}

export default PopupBlend;
