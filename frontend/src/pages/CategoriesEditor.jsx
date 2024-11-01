import './css/Main.css';
import './css/PostCreate.css';
import React, {useState} from "react";
import Navigation from "../components/Navigation";
import CategoriesSelect from "../components/CategoriesSelect";
import Requests from "../API/requests";

function CategoriesEditor() {
    const [selected_categories_list, setSelectedCategories_list] = useState({});

    async function fillData(selected) {
        console.log(selected);
        const resp = await Requests.get_category_by_id(selected.value);
        if (resp.state === true){
            document.getElementById('title').value = resp.data.title;
            document.getElementById('description').value = resp.data.description;
        }
        else
            alert(resp.message);
    }

    async function confirmEdit() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const category = selected_categories_list.value;
        if (title.trim() === '' || description.trim() === '') {
            alert('Пожалуйста, заполните заголовок и описание.');
        } else if (category) {
            alert('Выберите категорию.');
        }
        else {
            const resp = await Requests.edit_category(category, title, description, localStorage.getItem('token'));
            if (resp.state === true){
                window.location.reload();
            }
            else
                alert(resp.message);
        }
    }

    async function confirmDelete() {
        const category = selected_categories_list.value;
        if (category) {
            const resp = await Requests.delete_category(category, localStorage.getItem('token'));
            if (resp.state === true){
                window.location.reload();
            }
            else
                alert(resp.message);
        }
        else
            alert('Выберите категорию.');
    }

    return (
        <div className="main">
            <Navigation/>
            <div className={'post-data creation-post'}>
                <div className={'category-select'}>
                    <h1>Категорії:</h1>
                    <CategoriesSelect selected_categories_list={selected_categories_list}
                                      setSelectedCategories_list={setSelectedCategories_list}
                                      multi={false}
                                      onChange={fillData}/>
                </div>
                <h1>Назва:</h1>
                <input id={'title'} type={'text'} placeholder={'Коротка назва категорії'} />
                <h1>Пояснення:</h1>
                <textarea id={'description'} placeholder={'Детальніше про категорію'}/>
                <br/>
                <div className={'buttons-inline'}>
                    <button onClick={confirmEdit}>Зберегти</button>
                    <button onClick={confirmDelete}>Видалити</button>
                    <button onClick={()=> {window.location.href = '/createCategory'}}>Cтворити</button>
                </div>
            </div>
        </div>
    );
}

export default CategoriesEditor;
