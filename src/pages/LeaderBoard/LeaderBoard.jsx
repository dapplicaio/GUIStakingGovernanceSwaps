import React, { useContext, useState, useEffect } from 'react';
import { UALContext } from 'ual-reactjs-renderer';
import { Link } from 'react-router-dom';

import StoneImg from '../../images/stone-icon.png';
import WoodImg from '../../images/wood-icon.png';
import AppleImg from '../../images/food-icon.png';
import DiamondImg from '../../images/gems-icon.png';

import NavbarMenu from '../../components/NavbarMenu/NavbarMenu';
import { leaderboadrTable } from '../../services/wax.services';

import './LeaderBoard.scss';

function LeaderTableItem({ account, index }) {
    return (
        <div className="leader-table-item">
            <div className="main">
                <div><p>{index + 1}</p></div>
                <div><p>{account.account}</p></div>
            </div>
            <div className="resources">
                <div><p>{account.points}</p></div>
                <div><p>{account.wood}/hour</p></div>
                <div><p>{account.stone}/hour</p></div>
                <div><p>{account.food}/hour</p></div>
                <div><p>{account.gems}/hour</p></div>
            </div>
        </div>
    );
}

function LeaderBoard() {
    const { activeUser } = useContext(UALContext);
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const points = await leaderboadrTable('points');
                const stone = await leaderboadrTable('stone');
                const wood = await leaderboadrTable('wood');
                const gems = await leaderboadrTable('gems');

                const combinedData = combineLeaderboardData(points, stone, wood, gems);
                setLeaderboardData(combinedData);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchData();
    }, []);

    const combineLeaderboardData = (points, stone, wood, gems) => {
        const combinedMap = new Map();

        points.forEach(({ account, points }) => {
            combinedMap.set(account, { account, points, stone: 0, wood: 0, food: 0, gems: 0 });
        });

        stone.forEach(({ account, points }) => {
            if (combinedMap.has(account)) {
                combinedMap.get(account).stone = points;
            }
        });

        wood.forEach(({ account, points }) => {
            if (combinedMap.has(account)) {
                combinedMap.get(account).wood = points;
            }
        });

        gems.forEach(({ account, points }) => {
            if (combinedMap.has(account)) {
                combinedMap.get(account).gems = points;
            }
        });

        const combinedData = Array.from(combinedMap.values());
        return combinedData;
    };

    return (
        <div className="leaderboard">
            <div className="leaderboard_container-block">
                <div className="leaderboard-center">
                    <NavbarMenu />
                    <div className="leaderboard-center-block">
                        <div className="leaderboard-center-block_top">
                            <div className="input-block">
                                <input type="text" placeholder='Find user' />
                            </div>
                        </div>
                        <div className="leaderboard-center-block_container">
                            <div className="leader-table">
                                <div className="leader-table_container">
                                    <div className="leader-table-top">
                                        <div className="main">
                                            <div><p>Rank</p></div>
                                            <div><p>Username</p></div>
                                        </div>
                                        <div className="resources">
                                            <div><p>Points</p></div>
                                            <div className='th'><p>Wood</p><img src={WoodImg} alt="" /></div>
                                            <div className='th'><p>Stone</p><img src={StoneImg} alt="" /></div>
                                            <div className='th'><p>Food</p><img src={AppleImg} alt="" /></div>
                                            <div className='th'><p>Gems</p><img src={DiamondImg} alt="" /></div>
                                        </div>
                                    </div>
                                    <div className="leader-table-list">
                                        {leaderboardData.map((account, index) => (
                                            <LeaderTableItem key={index} account={account} index={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="leaderboard-bottom">
                        <div className="leaderboard-bottom_container">
                            <Link to={'/workplaces'}>Back</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaderBoard;
