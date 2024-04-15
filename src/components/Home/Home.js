import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UALContext } from 'ual-reactjs-renderer';

const Home = () => {
    const history = useHistory();
    const { activeUser, showModal } = useContext(UALContext);

    useEffect(() => {
        if (activeUser) {
            history.push('/workplaces');
          }else{
            history.push('/');
          }
    }, [activeUser, history])
  
    const connectWallet = () => {
      if (activeUser) {
        history.push('/workplaces');
      } else {
        showModal();
      }
    };
  
    return (
      <div className="center-container">
        <div className="logo-container">
          <h1>FarmingKingdom</h1>
        </div>
        <button className="btn" onClick={connectWallet}>Start Play</button>
      </div>
    );
  };

  export default Home;