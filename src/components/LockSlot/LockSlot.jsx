import React, { useContext, useEffect, useState } from 'react';
import { UALContext } from 'ual-reactjs-renderer';

import LockIcon from '../../images/lock.png'

import { fetchStakedItems, fetchUserToolAsset, stakeTool } from '../../services/wax.services';

import './LockSlot.scss';


function LockSlot() {
    const { activeUser } = useContext(UALContext);
    const [stakedItems, setStakedItems] = useState([]);
    const [userTools, setUserTools] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeUser) {
                    const data = await fetchUserToolAsset({ activeUser });
                    setUserTools(data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [activeUser]);

    useEffect(() => {
        fetchStakedItems({ activeUser })
            .then((data) => {
                setStakedItems(data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [activeUser])


    const handleEquip = () => {
        if (userTools) {
            stakeTool({activeUser, selectTool: userTools[0].asset_id, wpId: stakedItems[0].asset_id.asset_id})
            .then(() => {
                console.log('Successed');
            })
            .catch((error) => {
                console.error(error);
            })
        }else{
            console.error("USER HAVEN'T ANY TOOL");
        }
    }

    console.log(userTools);

    return (
        <div className="workplace-item_block-lock">
            <div className="workplace-item">
                <div className="workplace-item-content-lock">
                    <div className="asset-img-block-lock">
                        <img src={LockIcon} alt="" />
                    </div>
                </div>
            </div>
            <div className="workplace-item_action">
                <button onClick={() => handleEquip()}>Equip</button>
            </div>
        </div>
    );
}

export default LockSlot;
