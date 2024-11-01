import './css/Main.css';
import './css/PostCreate.css';
import Navigation from "../components/Navigation";
import Requests from "../API/requests";

function CreateCategory() {
    async function createCategory() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        if (title.trim() === '' || description.trim() === '') {
            alert('Пожалуйста, заполните заголовок и описание.');
        }
        else {
            const resp = await Requests.create_category(title, description, localStorage.getItem('token'));
            if (resp.state === true){
                window.location.href = '/categoriesEditor';
            }
            else
                alert(resp.message);
        }
    }

    return (
        <div className="main">
            <Navigation/>
            <div className={'post-data creation-post'}>
                <h1>Назва:</h1>
                <input id={'title'} type={'text'} placeholder={'Коротка назва категорії'} />
                <h1>Пояснення:</h1>
                <textarea id={'description'} placeholder={'Детальніше про категорію'}/>
                <br/>
                <div className={'buttons-inline'}>
                    <button onClick={createCategory}>Створити</button>
                    <button onClick={()=> {window.location.href = '/categoriesEditor'}}>Редагувати</button>
                </div>
            </div>
        </div>
    );
}

export default CreateCategory;
