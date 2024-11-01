import './css/Main.css';
import './css/Login.css';
import React from "react";
import Navigation from "../components/Navigation";

function Error() {
    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content-form'}>
                <h1>Щось пішло не так!</h1>
            </div>
        </div>
    );
}

export default Error;
