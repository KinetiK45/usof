import './css/Main.css';
import './css/Posts.css';
import './css/Users.css';
import React, {useEffect, useState} from "react";
import Requests from "../API/requests";
import Navigation from "../components/Navigation";
import Pages from "../components/Pages";

function Main() {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [field, setField] = useState(localStorage.getItem('users-select-field'));
    const [order, setOrder] = useState(localStorage.getItem('users-select-sort'));

    useEffect(()=>{
        document.getElementById('field').value = localStorage.getItem('users-select-field');
        document.getElementById('sort').value = localStorage.getItem('users-select-sort');
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.users_all(currentPage, order, field);
                if (resp.state === true){
                    setUsers(resp.data.rows);
                    setTotalPages(resp.data.totalPages);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [currentPage, order, field]);

    async function update_users() {
        setField(document.getElementById('field').value);
        setOrder(document.getElementById('sort').value);
        localStorage.setItem('users-select-field', document.getElementById('field').value);
        localStorage.setItem('users-select-sort', document.getElementById('sort').value);
    }

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'left-side-menu-block'}>
                    <div className={'main-menu'}>
                        <h2>Сортування</h2>
                        <select id="field" name="field">
                            <option value="id">ID</option>
                            <option value="registration_date">Дата</option>
                            <option value="nickname">Нік</option>
                            <option value="post_rating">Рейтинг постів</option>
                            <option value="comment_rating">Рейтинг коментарів</option>
                        </select>
                        <br/>
                        <select id="sort" name="sort">
                            <option value="ASC">за збільшенням</option>
                            <option value="DESC">за зменшенням</option>
                        </select>
                        <button onClick={update_users}>Примінити</button>
                    </div>
                </div>
                <div className={'main-content-users'}>
                    <div className={'users-center-block'}>
                        <div className={'users-block'}>
                            {users &&
                                users.map((user)=>(
                                    <div key={`user-line-${user.id}`} className={'user-line'}>
                                        <img alt={'avatar'} src={Requests.get_img_link(user.id)}/>
                                        <a href={`/profile/${user.id}`}>{user.nickname}</a>
                                        <div>{user.role}</div>
                                        <div>{
                                            new Date(user.registration_date).toLocaleTimeString().replace(/:\d\d$/, '') + ' ' +
                                            new Date(user.registration_date).toLocaleDateString()
                                        }</div>
                                        <div>💬 {user.comment_rating}</div>
                                        <div>📄 {user.post_rating}</div>
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                </div>
                <div className={'right-side-menu-block'}>
                    <div className={'pages-nav'}>
                        <Pages currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} onChange={update_users}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
