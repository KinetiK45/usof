import React, {useEffect, useState} from 'react';
import './Navigation.css';
import Requests from "../API/requests";
import DropdownMenu from "./DropdownMenu";
import {ProfileMenu} from "./ProfileMenu";

function Navigation() {
    const [userdate, setUserdate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                Requests.user_by_id(localStorage.getItem('user_id')).then((resp) => {
                    if (resp.state === true){
                        setUserdate(resp.data);
                    }
                })
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div id="Navigation">
            <div className={'nav-menu-item'}
                 onClick={()=>window.location.href = '/main'}>Головна</div>
            {localStorage.getItem('token') &&
                <div className={'nav-menu-item'}
                     onClick={()=>window.location.href = '/posts/create'}>Створити пост</div>
            }
            <div className={'nav-menu-item'}
                 onClick={()=>window.location.href = '/users'}>Користувачі</div>


            <div className={'nav-menu-item'}
                 id="profile-block">
                {localStorage.getItem('user_id') &&
                    <DropdownMenu triggerElement={
                        <div className={'profile-line'}>
                            <img key="avatar-nav" id="avatar-nav" src={Requests.get_img_link(localStorage.getItem('user_id'))} alt="avatar.IMG"/>
                            {userdate && <div>
                                {userdate.nickname}
                            </div>
                            }
                        </div>
                    } menuElement={<ProfileMenu/>}/>
                }
                {!localStorage.getItem('token') &&
                    <div className={'nav-menu-item profile-line'}
                         onClick={()=>window.location.href = '/login'}>Вхід</div>
                }
            </div>
        </div>
    );
}

export default Navigation;
