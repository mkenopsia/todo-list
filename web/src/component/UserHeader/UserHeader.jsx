import React, { useState } from 'react';
import BackupButton from "../BackupButton/BackupButton";
import ImportButton from '../ImportButton/ImportButton';
import './Header.css';

function UserHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <header className='app-header'>
            <div className='header-container'>
                <h1 className='app-name'>Todo-List</h1>
                <ImportButton/>
                <BackupButton/>
                <nav className='header-nav'>
                    {isLoggedIn ? (
                        <div className='user-info'>
                            привет
                        </div>
                    ) : (
                        <div className='user-info'>
                            Залогинься)
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default UserHeader; 