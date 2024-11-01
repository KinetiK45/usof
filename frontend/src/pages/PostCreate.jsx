import './css/Main.css';
import './css/PostCreate.css';
import React, {useState} from "react";
import Navigation from "../components/Navigation";
import Requests from "../API/requests";
import CategoriesSelect from "../components/CategoriesSelect";

function PostCreate() {
    const [selected_categories_list, setSelectedCategories_list] = useState([]);

    function getCategoryIds() {
        return selected_categories_list.map(element => Number.parseInt(element.value));
    }
    async function create_post() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const categories = getCategoryIds();
        if (title.trim() === '' || content.trim() === '') {
            alert('Пожалуйста, заполните заголовок и содержание.');
        } else if (categories.length === 0) {
            alert('Выберите как минимум одну категорию.');
        }
        else {
            const resp = await Requests.create_post(title, content, categories, localStorage.getItem('token'));
            if (resp.state === true)
                window.location.href = `/posts/${resp.data.postid}`;
            else
                alert(resp.message);
        }
    }

    return (
        <div className="main">
            <Navigation/>
            <div className={'post-data creation-post'}>
                <div className={'category-select'}>
                    <h1>Категорії:</h1>
                    <CategoriesSelect selected_categories_list={selected_categories_list} setSelectedCategories_list={setSelectedCategories_list}/>
                </div>
                <h1>Заголовок:</h1>
                <input id={'title'} type={'text'} placeholder={'Цей прост про...'} />
                <h1>Текст поста:</h1>
                <textarea id={'content'} placeholder={'Текст вашого поста...'}/>
                <br/>
                <button onClick={create_post}>Create</button>
            </div>
        </div>
    );
}

export default PostCreate;
