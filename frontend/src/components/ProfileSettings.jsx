import React, { useEffect, useState } from "react";
import "./ProfileSettings.css";
import Requests from "../API/requests";

export const ProfileSettings = ({ userdate }) => {
    const [localState, setLocalState] = useState({
        status: "",
        email: "",
        password: "",
        nickname: ""
    });
    const [newAvatar, setNewAvatar] = useState(null);

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const avatarImage = document.querySelector('.avatar');

        if (file && avatarImage) {
            setNewAvatar(file);
            const reader = new FileReader();

            reader.onload = function (e) {
                avatarImage.src = e.target.result;
            };

            reader.readAsDataURL(file);
        } else {
            console.error('File not selected or avatar element not found.');
        }
    }

    function showError(error_str) {
        alert(error_str);
    }

    async function saveChanges() {
        const r1 = await Requests.edit_user(localState, userdate.id, localStorage.getItem('token'));
        if (r1.state === false){
            return showError(r1.message);
        }
        if (newAvatar) {
            const r2 = await Requests.avatarUpload(newAvatar, userdate.id, localStorage.getItem('token'));
            if (r2.state === false){
                return showError(r1.message);
            }
        }
        window.location.reload();
    }


    useEffect(() => {
        setLocalState({
            status: userdate.status || "",
            email: userdate.email || "",
            password: userdate.password || "",
            nickname: userdate.nickname || ""
        });
        document.querySelector('.avatar-input').addEventListener('change', handleFileSelect);

    }, [userdate]);

    return (
        <div className={'settings'}>
            <div className={'left-side'}>
                {userdate && <img className="avatar"
                                  alt="avatar"
                                  src={Requests.get_img_link(userdate.id)} />}
                <label className="custom-file-upload">
                    <input type={'file'} className="avatar-input" accept={".jpg, .jpeg, .png"}/>
                    Загрузити аватар
                </label>
            </div>


            <div className={'right-side'}>
                <input
                    type={'text'}
                    placeholder={'nickname'}
                    className="nickname"
                    value={localState.nickname}
                    onChange={(e) =>
                        setLocalState({ ...localState, nickname: e.target.value })}
                />
                <div className={'status-row'}>
                    <svg className={'status-backgr'} width="400" height="91" viewBox="0 0 400 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g filter="url(#filter0_d_64_9)">
                            <path d="M4 0H396L380.32 41.5L396 83H4L19.68 41.5L4 0Z" fill="#3A3A3A"/>
                        </g>
                        <defs>
                            <filter id="filter0_d_64_9" x="0" y="0" width="400" height="91" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
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
                    <input className="profile-status"
                           type={'text'}
                           placeholder={'Status'}
                           value={localState.status}
                           onChange={(e) => setLocalState({ ...localState, status: e.target.value })}
                    />
                </div>
                <div className={'dop-info'}>
                    <div className="other-field">
                        <div className="field-name">Пошта:</div>
                        <input
                            type={'email'}
                            placeholder={'email'}
                            className="example-ex-ample"
                            value={localState.email}
                            onChange={(e) => setLocalState({ ...localState, email: e.target.value })}
                        />
                    </div>
                    <div className="other-field">
                        <div className="field-name">Пароль:</div>
                        <input
                            type={'password'}
                            placeholder={'password'}
                            className="input"
                            value={localState.password}
                            onChange={(e) => setLocalState({ ...localState, password: e.target.value })}
                        />
                    </div>
                </div>
                <div className={'submit-buttons'}>
                    <button onClick={saveChanges}>Зберегти</button>
                </div>
            </div>
        </div>
    );
};
