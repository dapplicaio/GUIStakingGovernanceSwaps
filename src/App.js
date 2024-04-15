import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Workplaces from './pages/Workplaces/Workplaces';
import Home from './components/Home/Home';

import Header from './components/Header/Header';
import Upgrade from './pages/Upgrade/Upgrade';
import Inventory from './pages/Inventory/Inventory';
import DAO from './pages/DAO/DAO';
import Swap from './pages/Swap/Swap';
import Voting from './pages/Voting/Voting';

import './App.css';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import Quests from './pages/Quests/Quests';
import Avatar from './pages/Avatar/Avatar';


function App() {
  const routes = [
    { path: "/workplaces", component: Workplaces },
    { path: "/workplaces:id", component: Workplaces },
    { path: "/upgrade", component: Upgrade },
    { path: "/inventory", component: Inventory },
    { path: "/blends", component: DAO },
    { path: "/swap", component: Swap },
    { path: "/voting", component: Voting },
    { path: "/leaderboard", component: LeaderBoard },
    { path: "/avatar", component: Avatar },
    { path: "/quests", component: Quests },
    { path: "/", component: Home }
  ];

  return (
    <Router>
      <div className="App">
        <div className="map-bg">
          <Header />
          <Switch>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} exact>
                <route.component />
              </Route>
            ))}
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;