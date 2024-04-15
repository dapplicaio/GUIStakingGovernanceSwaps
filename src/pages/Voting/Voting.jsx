import React, { useEffect, useState, useContext } from 'react';
import { UALContext } from 'ual-reactjs-renderer';
import NavbarMenu from '../../components/NavbarMenu/NavbarMenu';
import { fetchBalance, fetchVoteOptions, fetchVotingInfo, fetchWaxBalance, gvote, tokenStake } from '../../services/wax.services';
import './Voting.scss';

function Voting() {
    const { activeUser } = useContext(UALContext);
    const [stakeValue, setStakeValue] = useState('');
    const [unStakeValue, setUnStakeValue] = useState('');
    const [voteValue, setVoteValue] = useState('');
    const [activeTab, setActiveTab] = useState('automatic');
    const [selectedOption, setSelectedOption] = useState('');
    const [automaticVotesInfo, setAutomaticVotesInfo] = useState([]);
    const [generalVotesInfo, setGeneralVotesInfo] = useState([]);
    const [votesOptions, setVotesOptions] = useState({});
    const [balance, setBalance] = useState([]);
    const [WAXbalance, setWAXBalance] = useState([]);
    const [createVotingWindow, setCreateVotingWindow] = useState(false);

    useEffect(() => {
        fetchBalance({ activeUser })
            .then((data) => {
                setBalance(data)
            })
            .catch((error) => {
                console.log(error);
            })
    }, [activeUser]);

    useEffect(() => {
        fetchWaxBalance({ activeUser })
            .then((data) => {
                setWAXBalance(data)
            })
            .catch((error) => {
                console.log(error);
            })
    }, [activeUser]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchVotingInfo();
                const automaticVotes = data.filter(item => item.variable_to_change);
                const generalVotes = data.filter(item => !item.variable_to_change);

                setAutomaticVotesInfo(automaticVotes);
                setGeneralVotesInfo(generalVotes);

                await Promise.all(automaticVotes.map(async vote => {
                    const options = await fetchVoteOptions({ vote_name: vote.voting_name });
                    setVotesOptions(prevOptions => ({
                        ...prevOptions,
                        [vote.voting_name]: options
                    }));
                }));

                await Promise.all(generalVotes.map(async vote => {
                    const options = await fetchVoteOptions({ vote_name: vote.voting_name });
                    setVotesOptions(prevOptions => ({
                        ...prevOptions,
                        [vote.voting_name]: options
                    }));
                }));
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    function calculateDeadline(creationTime, secondsUntilExpiration) {
        const expirationDate = new Date((creationTime + secondsUntilExpiration) * 1000);
        const formattedExpirationDate = expirationDate.toISOString().split('T')[0].replace(/-/g, '.');
        const time = expirationDate.toLocaleTimeString('en-US', { timeZone: 'UTC' });
        return `UTC ${time} ${formattedExpirationDate}`;
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleVote = () => {
        gvote({ activeUser, voting_name: 'd', voting_option: 'a', voting_power: voteValue })
            .then(() => {
                console.log('Successfuly');
            })
    }

    const handleOptionChange = (changeEvent) => {
        setSelectedOption(changeEvent.target.value);
    };

    const handleStakeToken = () => {
        tokenStake({ activeUser, quantity: stakeValue })
            .then(() => {
                console.log('Token staked successfully :)');
                setStakeValue('')

                setTimeout(() => {
                    fetchWaxBalance({ activeUser })
                        .then((data) => {
                            setWAXBalance(data)
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }, 1500);

                setTimeout(() => {
                    fetchBalance({ activeUser })
                        .then((data) => {
                            setBalance(data)
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }, 1500);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleUnStakeToken = () => {
        // Handle Unstake Token
    };

    return (
        <div className={'voting'}>
            <div className="voting_container">
                <div className="voting-center">
                    <NavbarMenu />
                    {createVotingWindow ?
                        <div className="voting-center-block">
                            <div className="voting-top create">
                                <div className="voting-top-back">
                                    <button className='voting-block_cancel' onClick={() => setCreateVotingWindow(false)}>Cancel</button>
                                </div>
                            </div>
                            <div className="voting-center-contain">
                                <div className="voting-item create">
                                    <div className="voting-item_container">
                                        <div className="voting-item_viting-block">
                                            <div className="voting-item_info">
                                                <div className="voting-item_viting-block-left">
                                                    <div className='radio-input-block'>
                                                        <input
                                                            type="radio"
                                                            id={'vote1'}
                                                            name="drone"
                                                        />
                                                        <label htmlFor={'vote1'}>Wood</label>
                                                    </div>
                                                    <div className='radio-input-block'>
                                                        <input
                                                            type="radio"
                                                            id={'vote1'}
                                                            name="drone"
                                                        />
                                                        <label htmlFor={'vote1'}>Stone</label>
                                                    </div>
                                                    <div className='radio-input-block'>
                                                        <input
                                                            type="radio"
                                                            id={'vote1'}
                                                            name="drone"
                                                        />
                                                        <label htmlFor={'vote1'}>Food</label>
                                                    </div>
                                                    <div className='radio-input-block'>
                                                        <input
                                                            type="radio"
                                                            id={'vote1'}
                                                            name="drone"
                                                        />
                                                        <label htmlFor={'vote1'}>Gems</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="voting-item_viting-block-right">

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="voting-center-block">
                            <div className="voting-top">
                                <div className="voting-top-automatic-general">
                                    <p className={activeTab === 'automatic' ? 'active' : ''} onClick={() => handleTabClick('automatic')}>Automatic Voting</p>
                                    <p className={activeTab === 'general' ? 'active' : ''} onClick={() => handleTabClick('general')}>General Voting</p>
                                </div>
                                <div className="voting-top-stake-block">
                                    <button className="voting-block_btn" onClick={() => setCreateVotingWindow(true)}>
                                        + Create new Voting
                                    </button>
                                </div>
                            </div>
                            <div className="stake-token-center-contain">
                                <div className="stake-token_block">
                                    <div className="input-block">
                                        <input type="text" value={stakeValue} onChange={(e) => setStakeValue(e.target.value)} placeholder='0' />
                                        <p className='input-block-balance' onClick={() => setStakeValue(WAXbalance.balance.replace('WAX', '').trim())}>Balance: {WAXbalance ? WAXbalance.balance : '0 WAX'}</p>
                                    </div>
                                    <div className="action-block-btn">
                                        <button disabled={stakeValue === ''} onClick={() => handleStakeToken()} className='stake'>Stake</button>
                                    </div>
                                </div>
                                <div className="stake-token_block">
                                    <div className="input-block">
                                        <input type="text" value={unStakeValue} onChange={(e) => setUnStakeValue(e.target.value)} placeholder='0' />
                                        <p className='input-block-balance'>Staked balance: {balance ? balance.quantity : '0 WAX'}</p>
                                    </div>
                                    <div className="action-block-btn unstake">
                                        <button disabled={unStakeValue === ''} onClick={() => handleUnStakeToken()} className='unstake'>Unstake</button>
                                    </div>
                                </div>
                            </div>
                            <div className="voting-center-contain">
                                {activeTab === 'automatic' ?
                                    automaticVotesInfo.map((vote, index) => (
                                        <div key={index} className="voting-item automatic">
                                            <div className="voting-item_container">
                                                <h5 className='voting-item_about'>{vote.voting_name}:</h5>
                                                <div className="voting-item_viting-block">
                                                    <div className="voting-item_viting-block-left">
                                                        {votesOptions[vote.voting_name]
                                                            ?.map((vote, index) =>
                                                                <div key={index} className='radio-input-block'>
                                                                    <input
                                                                        type="radio"
                                                                        id={vote.id}
                                                                        name="drone"
                                                                        value={vote.voting_option}
                                                                        checked={selectedOption === vote.voting_option}
                                                                        onChange={handleOptionChange}
                                                                    />
                                                                    <label htmlFor={vote.id} className={selectedOption === vote.voting_option ? 'active' : ''}>{vote.voting_option}</label>
                                                                </div>
                                                            )}

                                                    </div>
                                                    <div className="voting-item_viting-block-right">
                                                        {(Date.now() / 1000) >= (vote.creation_time + vote.time_to_vote) ?
                                                            <></>
                                                            :
                                                            <div className="input-block">
                                                                <input type="text" value={voteValue} onChange={(e) => setVoteValue(e.target.value)} placeholder='0' />
                                                                <p className='input-block-balance'>Available for voting: 100 WAX</p>
                                                            </div>
                                                        }

                                                        <div className="action-block-btn">
                                                            <button
                                                                disabled={(Date.now() / 1000) >= (vote.creation_time + vote.time_to_vote)}
                                                                className={(Date.now() / 1000) >= (vote.creation_time + vote.time_to_vote) ? 'ended' : ''}
                                                                onClick={(Date.now() / 1000) >= (vote.creation_time + vote.time_to_vote) ? () => null : () => handleVote()}
                                                            >
                                                                {(Date.now() / 1000) >= (vote.creation_time + vote.time_to_vote) ? 'Ended' : 'Vote'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="voting-item_info-block">
                                                    <div className="voting-item_info-block_about">
                                                        {/* <p>Current swap ratio: 25 Wood {'>'} 1 WAX</p> */}
                                                        <p>Min Votes: {vote.min_staked_tokens} WAX</p>
                                                        <p>Vote goals: {vote.max_staked_tokens} WAX</p>
                                                        <p>Deadline: {calculateDeadline(vote.creation_time, vote.time_to_vote)}</p>
                                                        <p>Created by: {vote.creator}</p>
                                                        <p>Voting ID: {index}</p>
                                                    </div>
                                                    <div className="voting-item_info-block_total">
                                                        <div className="participants">
                                                            <p>Participants: 0</p>
                                                        </div>
                                                        <div className="total-votes">
                                                            <p>Total Votes: {vote.total_staked} WAX</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    generalVotesInfo.map((vote, index) => (
                                        <div key={index} className="voting-item general">
                                            <div className="voting-item_container">
                                                <h5 className='voting-item_about'>{vote.voting_name}:</h5>
                                                <div className="voting-item_viting-block">
                                                    <div className="voting-item_viting-block-left">
                                                        {votesOptions[vote.voting_name]
                                                            ?.map((vote_op, index) =>
                                                                <div key={index} className='radio-input-block'>
                                                                    <input
                                                                        type="radio"
                                                                        id={vote_op.id}
                                                                        name="drone"
                                                                        value="huey"
                                                                        checked={selectedOption === 'huey1'}
                                                                        onChange={handleOptionChange}
                                                                    />
                                                                    <label htmlFor={vote_op.id} className={selectedOption === 'huey1' ? 'active' : ''}>{vote_op.voting_option}</label>
                                                                </div>
                                                            )}

                                                    </div>
                                                    <div className="voting-item_viting-block-right">
                                                        <div className="input-block">
                                                            <input type="text" value={voteValue} onChange={(e) => setVoteValue(e.target.value)} placeholder='0' />
                                                            <p className='input-block-balance'>Available for voting: 100 WAX</p>
                                                        </div>
                                                        <div className="action-block-btn">
                                                            <button disabled={(Date.now() / 1000) >= (vote.creation_time + vote.time_to_vote)} className={(Date.now() / 1000) >= (vote.creation_time + vote.time_to_vote) && 'ended'}>{(Date.now() / 1000) >= (vote.creation_time + vote.time_to_vote) ? 'Ended' : 'Vote'}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="voting-item_info-block">
                                                    <div className="voting-item_info-block_about">
                                                        {/* <p>Current swap ratio: 25 Wood {'>'} 1 WAX</p> */}
                                                        <p>Min Votes: {vote.min_staked_tokens} WAX</p>
                                                        <p>Vote goals: {vote.max_staked_tokens} WAX</p>
                                                        <p>Deadline: {calculateDeadline(vote.creation_time, vote.time_to_vote)}</p>
                                                        <p>Created by: {vote.creator}</p>
                                                        <p>Voting ID: {index}</p>
                                                    </div>
                                                    <div className="voting-item_info-block_total">
                                                        <div className="participants">
                                                            <p>Participants: 0</p>
                                                        </div>
                                                        <div className="total-votes">
                                                            <p>Total Votes: {vote.total_staked} WAX</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Voting;
