import React from "react";
import './ProfileMenu.css';
import Requests from "../API/requests";

export const ProfileMenu = () => {

    return (
        <div className={'profile-menu-list'}>
            <a href={`/profile/${localStorage.getItem('user_id')}`}>Мій профіль</a>
            {localStorage.getItem('admin') === 'true' &&
                <a href={'/categoriesEditor'}>Управління категоріями</a>
            }
            <div onClick={async () => {
                await Requests.logout();
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                localStorage.removeItem('admin');
                window.location.href = '/login';
            }}>Вийти</div>
        </div>
    );
};
