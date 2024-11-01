import './css/Main.css';
import './css/Post.css';
import React, {useEffect, useState} from "react";
import Requests from "../API/requests";
import Navigation from "../components/Navigation";
import { useParams } from 'react-router-dom';
import {Message} from "../components/Message";
import {Comment} from "../components/Comment";
import ContentInput from "../components/ContentInput";
import Pages from "../components/Pages";

function Post() {
    const { post_id } = useParams();
    const [postdate, setPostdate] = useState(null);
    const [categories_list, setCategories_list] = useState(null);
    const [comments, setComments] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [creator_data, setCreator_data] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const post_categories_resp = await Requests.get_post_categories(post_id);

                const resultCategories = [];

                for (const category_data of post_categories_resp.data) {
                    const category = await Requests.get_category_by_id(category_data.category_id);
                    resultCategories.push(category.data);
                }
                setCategories_list(resultCategories);
            } catch (error) {
                window.location.href = '/error';
            }
        };

        fetchData();
    }, [post_id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.post_by_id(post_id);
                setPostdate(resp.data);

                const resp2 = await Requests.user_by_id(resp.data.creator_id);
                if (resp2.state === true){
                    setCreator_data(resp2.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [post_id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.post_comments_by_id(post_id);
                if (resp.state === true){
                    setTotalPages(resp.data.totalPages);
                    setComments(resp.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, []);

    async function create_comment(text) {
        const resp = await Requests.create_comment(post_id, text, localStorage.getItem('token'));
        if (resp.state === true){
            document.getElementById('input-area').value = '';
            await update_comments();
        }
    }

    async function update_comments(page) {
        console.log(page);
        const resp = await Requests.post_comments_by_id(post_id, page);
        if (resp.state === true) {
            setComments(resp.data);
            setTotalPages(resp.data.totalPages);
        }
    }


    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content-post'}>
                <div className={'post-data'}>
                    {postdate &&
                        <>
                            <h1>{postdate.title}</h1>
                            <div className={'categories-line'}>
                                {categories_list && categories_list.map((element) => (
                                    <div className={`post-category category-${element.id}`}
                                         id={`category-${element.id}`}
                                         key={`category-select-${element.id}`}>
                                        {element.title}
                                    </div>
                                ))}
                            </div>
                            <div className={'data-content'}>
                                <Message creator_data={creator_data} postdata={postdate}/>
                            </div>
                            <div className={'comments-block'}>
                                {comments &&
                                    comments.rows.map((element) => (
                                        <Comment key={`comment-${element.id}`} postdata={element} onChange={update_comments}/>
                                    ))
                                }
                            </div>
                        </>
                    }
                    <ContentInput onSubmit={create_comment}/>
                </div>

                <div className={'right-side-menu-block'}>
                    <div className={'pages-nav'}>
                        <Pages currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} onChange={update_comments}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;
