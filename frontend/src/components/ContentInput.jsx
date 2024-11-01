import './ContentInput.css';

function ContentInput({onSubmit}) {
    function send() {
        const text = document.getElementById('input-area').value;
        if (text)
            onSubmit(text);
    }

    return (
        <div className={'text-input'}>
            <textarea id={'input-area'} placeholder={'Напишіть свій коментар...'}></textarea>
            <div className={'create-comment'}
                 onClick={send}
            >
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1C1.77669 7.72002 3.80925 10.1352 11.5 11C4.46735 11.6131 1.9325 13.539 1 21L19 11L1 1Z" fill="#D9D9D9" stroke="#D9D9D9" strokeWidth="0.5"/>
                </svg>
            </div>
        </div>
    );
}

export default ContentInput;
