import React from "react";
import "./ProfileInfo.css";
import Requests from "../API/requests";

export const ProfileInfo = ({userdate}) => {
    return (
        <div className={'profile'}>
            <div className={'left-side'}>
                {userdate && <img className="avatar"
                                  alt="avatar"
                                  src={Requests.get_img_link(userdate.id)} />}
            </div>


            <div className={'right-side'}>
                {userdate &&
                    <div className="nickname">{userdate.nickname}</div>
                }
                <div className={'status-row'}>
                    <svg className={'status-backgr'} width="400" height="91" viewBox="0 0 400 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_64_9)">
                            <path d="M4 0H396L380.32 41.5L396 83H4L19.68 41.5L4 0Z" fill="#3A3A3A"/>
                        </g>
                        <defs>
                            <filter id="filter0_d_64_9" x="0" y="0" width="400" height="91" filterUnits="userSpaceOnUse">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dy="4"/>
                                <feGaussianBlur stdDeviation="2"/>
                                <feComposite in2="hardAlpha" operator="out"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_64_9"/>
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_64_9" result="shape"/>
                            </filter>
                        </defs>
                    </svg>
                    {userdate &&
                        <div className="profile-status">{userdate.status ? userdate.status : 'Статуса немає'}</div>
                    }
                </div>
                <div className={'dop-info'}>
                    {userdate &&
                        <div>Дата реєстрації: {
                            new Date(userdate.registration_date).toLocaleTimeString().replace(/:\d\d$/, '') + ' ' +
                            new Date(userdate.registration_date).toLocaleDateString()
                        }</div>
                    }
                    {userdate &&
                        <div>Рейтинг: 💬{userdate.comment_rating} 📄{userdate.post_rating}</div>
                    }
                </div>
            </div>

        </div>
    );
};
