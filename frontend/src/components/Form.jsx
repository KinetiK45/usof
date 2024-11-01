import React, { useState } from 'react';
import './Form.css';
import TextInput from "./TextInput";

function Form(props) {
    const [responseMessage, setResponseMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {};
        props.fields.forEach((element) => {
            formData[element.name] = document.getElementById(element.id).value;
        });

        props.onsubm(formData, setResponseMessage);
    };

    return (
        <div>
            {responseMessage && <p id="Error">{responseMessage}</p>}
            <form onSubmit={handleSubmit}>
                <h2 key="form-title">{props.title}</h2>
                {props.fields.map((element) => (
                    <div className={'input-text-block'} key={`block-${element.id}`}>
                        <label key={`label-${element.id}`} htmlFor={element.id}>{element.label + ':'}</label>
                        <TextInput key={element.id} {...element} label={undefined} />
                    </div>
                ))}
                <button type="submit">Відправити</button>
            </form>
        </div>
    );
}

export default Form;
