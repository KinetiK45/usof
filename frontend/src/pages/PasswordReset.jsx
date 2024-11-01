import './css/Main.css';
import './css/Login.css';
import React from "react";
import Requests from "../API/requests";
import {useParams} from "react-router-dom";
import Navigation from "../components/Navigation";

const displayError = (errorMessage) => {
    const errorsContainer = document.querySelector('.errors');
    errorsContainer.textContent = errorMessage;
    errorsContainer.style.display = 'block';
    setTimeout(()=>{errorsContainer.style.display = 'none'}, 5000);
};

function Login() {
    const { token } = useParams();

    async function recover_password() {
        const password = document.getElementById('password').value.trim();

        if (password === '') {
            return displayError('Заполните все поля');
        }

        const resp = await Requests.passwordResetConfirm(token, password);
        if (resp.state === true){
            window.location.href = '/login';
        }
        else
            displayError(resp.message);
    }

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content-form'}>
                <h1>Уведіть новий пароль</h1>
                <div className={'errors'}></div>
                <div className={'inputs'}>
                    <label htmlFor={'password'}>Пошта:</label>
                    <input id={'password'} name={'password'} type={'password'} placeholder={'password'}/>
                </div>
                <br/>
                <button className={'form-submit'} onClick={recover_password}>Змінити пароль</button>
            </div>
        </div>
    );
}

export default Login;
