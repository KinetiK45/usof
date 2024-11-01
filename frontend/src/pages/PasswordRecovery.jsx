import './css/Main.css';
import './css/Login.css';
import React from "react";
import Requests from "../API/requests";
import Navigation from "../components/Navigation";

async function recover_password() {
    const email = document.getElementById('email').value.trim();

    if (email === '') {
        return displayError('Заполните все поля');
    }

    const resp = await Requests.passwordResetCreate(email);
    if (resp.state === true){
        alert(resp.message);
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
    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content-form'}>
                <h1>Відновлення паролю</h1>
                <div className={'errors'}></div>
                <div className={'inputs'}>
                    <label htmlFor={'email'}>Пошта:</label>
                    <input id={'email'} name={'email'} type={'text'} placeholder={'email'}/>
                </div>
                <div className={'text-line'}>
                    <p>Немає аккаунту? <a href={'/registration'}>Зареєструватися</a></p>
                </div>
                <br/>
                <button className={'form-submit'} onClick={recover_password}>Відправити листа</button>
            </div>
        </div>
    );
}

export default Login;
