import React, { useContext, useState, useEffect } from 'react';
import { UALContext } from 'ual-reactjs-renderer';
import Countdown from 'react-countdown';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom'; 

import { claimRes, fetchStakedItems } from '../../services/wax.services';

import NavbarMenu from '../../components/NavbarMenu/NavbarMenu';
import FarmItem from '../../components/FarmItem/FarmItem';

import StoneIcon from '../../images/stone-icon.png';
import WoodIcon from '../../images/wood-icon.png';
import FoodIcon from '../../images/food-icon.png';
import GemsIcon from '../../images/gems-icon.png';

import KitchenFarmItemImg from '../../images/farm_items/kitchen/kitchen_for_food.png';
import StoneFarmItemImg from '../../images/farm_items/stone/stone_quarry.png';
import LumberFarmItemImg from '../../images/farm_items/lember/lember_mill.png';
import GemsFarmItemImg from '../../images/farm_items/crystal/crystal_wll.png';
import StarLeaderImg from '../../images/star.png';

import LockSlot from '../../components/LockSlot/LockSlot';
import AddSlot from '../../components/AddSlot/AddSlot';
import EquipedSlot from '../../components/EquipedSlot/EquipedSlot';


import './Workplaces.scss';



function Workplaces() {
    const { activeUser } = useContext(UALContext);
    const history = useHistory();

    const [isClaimButtonDisabled, setIsClaimButtonDisabled] = useState(false);
    const [startCountdown, setStartCountdown] = useState(false);

    const [stakedItems, setStakedItems] = useState([]);
    const [selectedFarmItem, setSelectedFarmItem] = useState('');

    const handleClaimRes = () => {
        if (!isClaimButtonDisabled) {
            claimRes({ activeUser })
                .then(() => {
                    console.log('Resources claimed');
                    setIsClaimButtonDisabled(true);
                    setStartCountdown(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        fetchStakedItems({ activeUser })
            .then((data) => {
                console.log(data);
                setStakedItems(data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [activeUser])

    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            setIsClaimButtonDisabled(false);
            setStartCountdown(false);
            return <span>Claim Now!</span>;
        } else {
            return (
                <span>
                    Left to the next production: {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
                </span>
            );
        }
    };

    const handleFarmItemClick = (item) => {
        setSelectedFarmItem(item);

        // history.push(`/workplaces/${filteredStakedItems[0].asset_id.asset_id}`);
    };
    const getIcon = () => {
        switch (selectedFarmItem) {
            case 'food':
                return FoodIcon;
            case 'stone':
                return StoneIcon;
            case 'wood':
                return WoodIcon;
            case 'gems':
                return GemsIcon;
            default:
                return FoodIcon;
        }
    };

    // Filter stakedItems based on selectedFarmItem
    const filteredStakedItems = stakedItems.filter(item => item.asset_id.data.faction === selectedFarmItem);

    console.log(stakedItems);

    return (
        <div className="workplaces">
            <div className="workplaces_container">
                <div className="workplaces-farmitem-left">
                    <div className="workplaces-farmitem-left_container">
                        <FarmItem
                            image={KitchenFarmItemImg}
                            onClick={() => handleFarmItemClick('food')}
                            name='kitchen'
                        />
                        <FarmItem
                            image={StoneFarmItemImg}
                            onClick={() => handleFarmItemClick('stone')}
                            name='stone'
                        />
                    </div>
                </div>
                <div className="workplaces-center">
                    <NavbarMenu />
                    <div className="workplaces-center-block">
                        {filteredStakedItems[0] ?
                            <div className="workplaces-center-block_container">

                                <div className="workplaces-top">
                                    <div className="time-to-claim">
                                        <Countdown
                                            date={Date.now() + 3600000}
                                            renderer={renderer}
                                            onComplete={handleClaimRes}
                                        />
                                    </div>
                                    <div className="claim-block">
                                        <div className="claim-block_resource">
                                            <p>500</p>
                                            <img src={getIcon()} alt="" />
                                        </div>
                                        <button className={'claim-block_btn'} onClick={handleClaimRes} disabled={isClaimButtonDisabled}>
                                            Claim
                                        </button>
                                    </div>
                                </div>
                                <div className="workplaces-items-list">
                                    {selectedFarmItem !== '' &&
                                        <>
                                            {!filteredStakedItems[0].staked_items
                                                ?
                                                <EquipedSlot item={filteredStakedItems[0].staked_items[0]} />
                                                :
                                                <LockSlot />
                                            }
                                            {[...Array(3)].map((_, index) => (
                                                <AddSlot key={index} />
                                            ))}
                                        </>
                                    }

                                </div>

                            </div>
                            :
                            <div className="workplaces-center-block_container">
                                <h2>No data</h2>
                            </div>
                        }

                    </div>
                    <div className="leaderboard">
                        <div className="leaderboard_container">
                            <img src={StarLeaderImg} alt="star" />
                            <Link to={'/leaderboard'}>Leaderboard</Link>
                        </div>
                    </div>
                </div>
                <div className="workplaces-farmitem-right">
                    <div className="workplaces-farmitem-right_container">
                        <FarmItem
                            image={LumberFarmItemImg}
                            onClick={() => handleFarmItemClick('wood')}
                            name='lumber'
                        />
                        <FarmItem
                            image={GemsFarmItemImg}
                            onClick={() => handleFarmItemClick('gems')}
                            name='gems'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Workplaces;

