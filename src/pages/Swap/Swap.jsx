import React, { useEffect, useState, useContext } from 'react';
import { UALContext } from 'ual-reactjs-renderer';

import { resourceСost, swap } from '../../services/wax.services';

import StoneImg from '../../images/stone-icon.png';
import WoodImg from '../../images/wood-icon.png';
import AppleImg from '../../images/food-icon.png';
import DiamondImg from '../../images/gems-icon.png';

import NavbarMenu from '../../components/NavbarMenu/NavbarMenu';
import TestTokenIcon from '../../images/token_test.png';
import SwapIcon from '../../images/swap-icon.png';
import './Swap.scss';


function Swap() {
    const { activeUser } = useContext(UALContext);
    const [resourcesCostInfo, setResourcesCostInfo] = useState([]);
    const [selectedResourceRatio, setSelectedResourceRatio] = useState(0);
    const [resvalue, setResValue] = useState('');
    const [selectedResource, setSelectedResource] = useState('food');

    useEffect(() => {
        const selectedResourceInfo = resourcesCostInfo.find(info => info.resource_name === selectedResource);
        if (selectedResourceInfo) {
            setSelectedResourceRatio(parseFloat(selectedResourceInfo.ratio));
        }
    }, [resourcesCostInfo, selectedResource])

    const handleSwap = () => {
        swap({activeUser, resource: selectedResource, amount2swap: resvalue})
            .then(() => {
                console.log('Success swap');

                setResValue('');
            })
            .catch((error => {
                console.log(error);
            }))
    }

    const calculateTokenAmount = () => {
        if (resvalue === '') {
            return '0.00';
        } else {
            const amount2swap = parseFloat(resvalue);
            const selectedResourceInfo = resourcesCostInfo.find(info => info.resource_name === selectedResource);
            console.log(selectedResourceInfo);
            if (selectedResourceInfo) {
                const ratio = parseFloat(selectedResourceInfo.ratio);
                console.log(ratio);
                const token_amount = amount2swap / ratio;
                return token_amount.toFixed(3);
            } else {
                return '0.00';
            }
        }
    };

    useEffect(() => {
        resourceСost()
            .then((data) => {
                setResourcesCostInfo(data)
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    console.log(selectedResourceRatio);

    return (
        <div className={'swap'}>
            <div className="swap_container">
                <div className="swap-center">
                    <NavbarMenu />
                    <div className="swap-center-block">
                        <div className="swap-center-contain">
                            <div className="res-block">
                                <div className="input-block">
                                    <input type="text" value={resvalue} onChange={(e) => setResValue(e.target.value)} placeholder='0' />
                                    <p className='input-block-balance'>Balance: 0</p>
                                </div>
                                <select value={selectedResource} onChange={(e) => setSelectedResource(e.target.value)}>
                                    <option value="food">Food</option>
                                    <option value="stone">Stone</option>
                                    <option value="wood">Wood</option>
                                    <option value="gems">Gems</option>
                                </select>
                            </div>
                            <div className="token-block">
                                <div className="token-block-result">
                                    <p>{calculateTokenAmount()}</p>
                                </div>
                                <div className="token-block-token">
                                    <img src={TestTokenIcon} alt="" />
                                    <p>WAX</p>
                                </div>
                            </div>
                            <div className="action-block">
                                <div className="action-block-info">
                                    <p>1 WAX = {selectedResourceRatio} {selectedResource}</p>
                                    <img src={SwapIcon} alt="" />
                                </div>
                                <div className="action-block-btn">
                                    <button disabled={resvalue === ''} onClick={() => handleSwap()}>Swap</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Swap;
