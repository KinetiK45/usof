import './css/Main.css';
import './css/PostCreate.css';
import React, {useEffect, useState} from "react";
import Navigation from "../components/Navigation";
import Requests from "../API/requests";
import CategoriesSelect from "../components/CategoriesSelect";
import {useParams} from "react-router-dom";

function PostEdit() {
    const [selected_categories_list, setSelectedCategories_list] = useState([]);
    const { post_id } = useParams();
    const [postdate, setPostdate] = useState(null);
    const [postCategories, setPostCategories] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.post_by_id(post_id);
                setPostdate(resp.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [post_id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const post_categories_resp = await Requests.get_post_categories(post_id);

                const resultCategories = [];

                for (const category_data of post_categories_resp.data) {
                    const category = await Requests.get_category_by_id(category_data.category_id);
                    resultCategories.push(category.data);
                }
                setPostCategories(resultCategories.map(item => item.id))
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [post_id]);

    function getCategoryIds() {
        return selected_categories_list.map(element => Number.parseInt(element.value));
    }
    async function edit_post() {
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const categories = getCategoryIds();
        if (title.trim() === '' || content.trim() === '') {
            alert('Пожалуйста, заполните заголовок и содержание.');
        }
        else {
            const edited_data = {
                title: title,
                content: content,
                categories: categories
            };
            const resp = await Requests.edit_post(edited_data, post_id, localStorage.getItem('token'));
            if (resp.state === true)
                window.location.href = `/posts/${post_id}`;
            else
                alert(resp.message);
            console.log(categories);
        }
    }

    return (
        <div className="main">
            <Navigation/>
            <div className={'post-data creation-post'}>
                {postdate &&
                    <>
                        <div className={'category-select'}>
                            <h1>Категорії:</h1>
                            {postCategories &&
                                <CategoriesSelect selected_categories_list={selected_categories_list}
                                                  setSelectedCategories_list={setSelectedCategories_list}
                                                  already_selected={postCategories}
                                />
                            }
                        </div>
                        <h1>Заголовок:</h1>
                        <input defaultValue={postdate.title} id={'title'} type={'text'} placeholder={'Цей прост про...'} />
                        <h1>Текст поста:</h1>
                        <textarea defaultValue={postdate.content} id={'content'} placeholder={'Текст вашого поста...'}/>
                        <br/>
                        <button onClick={edit_post}>Редагувати</button>
                    </>
                }
            </div>
        </div>
    );
}

export default PostEdit;
