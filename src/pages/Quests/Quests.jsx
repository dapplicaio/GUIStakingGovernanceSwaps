import React, { useContext, useEffect, useState } from 'react';
import { UALContext } from 'ual-reactjs-renderer';
import NavbarMenu from '../../components/NavbarMenu/NavbarMenu';

import ClaimedIcon from '../../images/claimed_icon.png';

import { collectQuest, fetchQuests } from '../../services/wax.services';

import './Quests.scss';

function Quests() {
    const { activeUser } = useContext(UALContext);
    const [quests, setQuests] = useState([]);
    const [questIsDone, setQuestIsDone] = useState(false);

    useEffect(() => {
        const fetchUserQuests = async () => {
            try {
                if (activeUser) {
                    const data = await fetchQuests();
                    const userQuests = data.find(quest => quest.player === activeUser.accountName);
                    if (userQuests) {
                        setQuests(userQuests.quests);
                    } else {
                        setQuests([]);
                    }
                }
            } catch (error) {
                console.error('Error fetching quests:', error);
            }
        };

        fetchUserQuests();
    }, [activeUser]);

    const handleClaim = (inx) => {
        collectQuest({ activeUser, index: inx })
            .then(() => {
                console.log('Successfuly');

                setQuestIsDone(true);

                setTimeout(async () => {
                    try {
                        if (activeUser) {
                            const data = await fetchQuests();
                            const userQuests = data.find(quest => quest.player === activeUser.accountName);
                            if (userQuests) {
                                setQuests(userQuests.quests);
                            } else {
                                setQuests([]);
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching quests:', error);
                    }
                }, 2000);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => setQuestIsDone(false));
    }

    console.log(quests);

    return (
        <div className="quests">
            <div className="quests_container">
                <div className="quests-center">
                    <NavbarMenu />
                    <div className="quests-center-block">
                        <div className="quests-center-top">
                            <select defaultValue="All resources">
                                <option>All types</option>
                            </select>
                            <select defaultValue="All resources">
                                <option>In progress</option>
                            </select>
                        </div>
                        <div className="quests-list">
                            {quests.map((quest, index) => (
                                <div className="quests-item" key={index}>
                                    <div className="quest-number">
                                        <p>{index + 1}</p>
                                    </div>
                                    <div className="quest-type">
                                        <p>{quest.type}</p>
                                    </div>
                                    <div className="quest-info">
                                        <p>{quest.description}</p>
                                    </div>
                                    <div className="quest-loader-block">
                                        <div className="quest-loader">
                                            <span style={{ width: `${quest.current_amount >= quest.required_amount ? '100%' : `${((parseFloat(quest.current_amount)) / parseFloat(quest.required_amount)) * 100}%`}` }}></span>
                                        </div>
                                        <p>{parseFloat(quest.current_amount)}/{parseFloat(quest.required_amount)}</p>
                                    </div>
                                    {questIsDone ?
                                        <div className='reward-block claimed'>
                                            <p className='claimed'>Claimed</p>
                                            <img src={ClaimedIcon} alt="claimed" />
                                        </div>
                                        :
                                        <div className='reward-block'>
                                            {quest.current_amount >= quest.required_amount ?
                                                <button onClick={() => handleClaim(index)}>Claim {parseFloat(quest.reward)} WAX</button>
                                                :
                                                <p>Reward: {parseFloat(quest.reward)} WAX</p>
                                            }
                                        </div>
                                    }

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Quests;
