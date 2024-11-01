import './css/Main.css';
import './css/Posts.css';
import React, {useEffect, useState} from "react";
import Requests from "../API/requests";
import Navigation from "../components/Navigation";
import {PostBlock} from "../components/PostBlock";
import MainMenu from "../components/MainMenu";
import CategoriesSelect from "../components/CategoriesSelect";
import Pages from "../components/Pages";

function Main() {
    const [posts, setPosts] = useState([]);
    const [posts_headers, setPosts_headers] = useState({
        page: 1,
        field: null,
        order: null,
        categories: null,
        date_from: null,
        date_to: null
    });

    const categoriesSave = ()=>{
        if (localStorage.getItem('main-menu-categories'))
            return JSON.parse(localStorage.getItem('main-menu-categories')).map((element) => element.value);
        return [];
    }

    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [selected_categories_list, setSelectedCategories_list] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                Requests.posts_all(posts_headers).then((resp) => {
                    if (resp.state === true){
                        setPosts(resp.data.rows);
                        setTotalPages(resp.data.totalPages);
                    }
                })
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [posts_headers]);

    function update_posts(page) {
        posts_headers.categories = JSON.stringify(categoriesSave());
        posts_headers.page = page;
        Requests.posts_all(posts_headers).then((resp) => {
            if (resp.state === true){
                setPosts(resp.data.rows);
                setTotalPages(resp.data.totalPages);
            }
        })
    }

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'left-side-menu-block'}>
                    <MainMenu posts_headers={posts_headers}
                              setPosts_headers={setPosts_headers}
                              onUpdate={update_posts}/>
                </div>
                <div className={'posts-center-block'}>
                    <div>
                        <CategoriesSelect selected_categories_list={selected_categories_list}
                                          setSelectedCategories_list={setSelectedCategories_list}
                                          already_selected={categoriesSave()}/>
                    </div>
                    {posts && posts.length > 0 &&
                        <div className={'posts-block'}>
                            {posts.map((element) => (
                                <PostBlock key={`post-${element.id}`} {...element}/>
                            ))}
                        </div>
                    }
                    {posts && posts.length === 0 &&
                        <div>Здається тут нічого немає...</div>
                    }
                </div>
                <div className={'right-side-menu-block'}>
                    <div className={'pages-nav'}>
                        <Pages currentPage={currentPage}
                               totalPages={totalPages}
                               setCurrentPage={setCurrentPage}
                               onChange={update_posts}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
