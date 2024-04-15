import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 

import './NavbarMenu.scss';

const menuItems = [
    { path: "/workplaces", label: "Workplaces" },
    { path: "/upgrade", label: "Upgrade" },
    { path: "/inventory", label: "Inventory" },
    { path: "/blends", label: "Blends" },
    { path: "/quests", label: "Quests" },
    { path: "/avatar", label: "Avatars" },
    { path: "/voting", label: "Voting" },
    { path: "/swap", label: "Swap" },
];

function NavbarMenu() {
    const location = useLocation();

    return (
        <div className="navbar-menu">
            {menuItems.map(item => (
                <div key={item.path} className={`navbar-menu-item ${location.pathname === item.path ? 'active' : ''}`}>
                    <Link to={item.path}>{item.label}</Link>
                </div>
            ))}
        </div>
    );
}

export default NavbarMenu;
