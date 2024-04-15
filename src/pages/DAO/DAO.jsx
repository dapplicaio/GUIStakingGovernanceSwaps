import React, { useContext, useEffect, useState } from 'react';
import { UALContext } from 'ual-reactjs-renderer';

import NavbarMenu from '../../components/NavbarMenu/NavbarMenu';

import { fetchBlends, fetchUserToolAsset } from '../../services/wax.services';

import './DAO.scss';
import PopupBlend from '../../components/PopupBlend/PopupBlend';

function DAO() {
    const { activeUser } = useContext(UALContext);

    const [blends, setBlends] = useState([])
    const [userToolAsset, setUserToolAsset] = useState([]);
    const [selectedItemsForBland, setSelectedItemsForBland] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedBlend, seSelectedBlend] = useState(null);
    


    useEffect(() => {
        fetchBlends()
            .then((data) => {
                setBlends(data)
            })
            .catch((error) => {
                console.error(error);
            })
    }, [activeUser])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (activeUser) {
                    const data = await fetchUserToolAsset({ activeUser });
                    setUserToolAsset(data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [activeUser]);

    const togglePopup = (item) => {
        setShowPopup(!showPopup);
        seSelectedBlend(item)
        setSelectedItemsForBland([]);
    };

    return (
        <div className={'blend'}>
            <div className="blend_container">
                <div className="blend-center">
                    <NavbarMenu />
                    <div className="blend-center-block">
                        <div className="blend-center-top">
                            <select defaultValue={'All resources'}>
                                <option>All resources</option>
                                <option>Food</option>
                                <option>Stone</option>
                                <option>Wood</option>
                                <option>Gems</option>
                            </select>
                        </div>
                        <div className="blend-list">
                            {blends.map((item) => {
                                const blendComponentsMatch = userToolAsset.some(asset => asset.template.template_id === item.blend_components[0].template_id || asset.template.template_id === item.blend_components[1].template_id);
                                const isAvailable = blendComponentsMatch && userToolAsset.some(asset => Number(asset.template.template_id) !== Number(item.blend_components[0].template_id) && Number(asset.template.template_id) !== Number(item.blend_components[1].template_id));
                                return (
                                    <div key={item?.asset_id} className={`blend-item ${!isAvailable ? '' : 'unavailable'}`} onClick={() => togglePopup(item)}>
                                        <div className="blend-item_img">
                                            <img src={`https://atomichub-ipfs.com/ipfs/${item.resulting_item.immutable_data.img}`} alt="" />
                                        </div>
                                        <div className="blend-item_info">
                                            <div className="blend-item_info_name">
                                                <p>{item.resulting_item.name}</p>
                                                <img src="" alt="" />
                                            </div>
                                            <div className="blend-item_info_about">
                                                <p>Produces</p>
                                                <span>100 food/hour</span>
                                            </div>
                                            <div className="blend-item_info_level">
                                                <p>Level</p>
                                                <span>1</span>
                                            </div>
                                            <div className="blend-items">
                                                <div className="blend-items_title">
                                                    <p>Blend these items</p>
                                                </div>
                                                <div className="blend-items_receipt">
                                                    <div className="blend-items_receipt-item">
                                                        <img src={`https://atomichub-ipfs.com/ipfs/${item.blend_components[0].immutable_data.img}`} alt="" />
                                                    </div>
                                                    <div className="blend-items_receipt-plus">
                                                        +
                                                    </div>
                                                    <div className="blend-items_receipt-item">
                                                        <img src={`https://atomichub-ipfs.com/ipfs/${item.blend_components[1].immutable_data.img}`} alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {showPopup && <PopupBlend onClose={togglePopup} selectedBlend={selectedBlend} selectedItemsForBland={selectedItemsForBland} setSelectedItemsForBland={setSelectedItemsForBland} />}
        </div>
    );
}

export default DAO;
