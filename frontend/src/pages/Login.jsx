import './css/Main.css';
import './css/Login.css';
import React, {useEffect} from "react";
import Requests from "../API/requests";
import Navigation from "../components/Navigation";

async function handle_auth() {
    const login = document.getElementById('login').value.trim();
    const password = document.getElementById('password').value.trim();

    if (login === '' || password === '') {
        return displayError('Заполните все поля');
    }

    const resp = await Requests.login(login, password);
    if (resp.state === true){
        localStorage.setItem('user_id', resp.data.user_id);
        localStorage.setItem('token', resp.data.auth_key);
        localStorage.setItem('admin', resp.data.role === 'admin');
        window.location.href = `/profile/${resp.data.user_id}`;
    }
    else
        displayError(resp.message);
}

const displayError = (errorMessage) => {
    const errorsContainer = document.querySelector('.errors');
    errorsContainer.textContent = errorMessage;
    errorsContainer.style.display = 'block';
    setTimeout(()=>{errorsContainer.style.display = 'none'}, 5000);
};

function Login() {

    useEffect(()=>{
        if (localStorage.getItem('user_id')){
            window.location.href = `/profile/${localStorage.getItem('user_id')}`;
        }
    }, [])

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content-form'}>
                <h1>Вхід</h1>
                <div className={'errors'}></div>
                <div className={'inputs'}>
                    <label htmlFor={'login'}>Логін:</label>
                    <input id={'login'} name={'login'} type={'text'} placeholder={'login'}/>
                    <label htmlFor={'password'}>Пароль:</label>
                    <input id={'password'} name={'password'} type={'password'} placeholder={'password'}/>
                </div>
                <div className={'text-line'}>
                    <p>Немає аккаунту? <a href={'/registration'}>Зареєструватися</a></p>
                </div>
                <div className={'text-line'}>
                    <p>Забули пароль? <a href={'/password-recovery'}>Відновлення</a></p>
                </div>
                <br/>
                <button className={'form-submit'} onClick={handle_auth}>Увійти</button>
            </div>
        </div>
    );
}

export default Login;
