import './MainMenu.css';
import {useEffect} from "react";
function MainMenu({posts_headers, onUpdate}) {

    useEffect(()=>{
        document.getElementById('field').value = localStorage.getItem('main-menu-select-field');
        document.getElementById('sort').value = localStorage.getItem('main-menu-select-sort');
        document.getElementById('is_active').value = localStorage.getItem('main-menu-select-is_active');
        document.getElementById('date_from').value = localStorage.getItem('main-menu-select-date_from');
        document.getElementById('date_to').value = localStorage.getItem('main-menu-select-date_to');
        update_posts();
    }, []);

    function update_with_save() {
        update_posts();
    }
    function update_posts() {
        posts_headers.field = document.getElementById('field').value;
        posts_headers.order = document.getElementById('sort').value;
        posts_headers.date_from = document.getElementById('date_from').value;
        posts_headers.date_to = document.getElementById('date_to').value;
        posts_headers.is_active = document.getElementById('is_active').value;
        posts_headers.page = 1;
        localStorage.setItem('main-menu-select-field', document.getElementById('field').value);
        localStorage.setItem('main-menu-select-sort', document.getElementById('sort').value);
        localStorage.setItem('main-menu-select-is_active', document.getElementById('is_active').value);
        localStorage.setItem('main-menu-select-date_from', document.getElementById('date_from').value);
        localStorage.setItem('main-menu-select-date_to', document.getElementById('date_to').value);
        onUpdate();
    }

    return (
        <div className={'main-menu'}>
            <h2>Сортування</h2>
            <div className={'select-box'}>
                <select id="field" name="field">
                    <option value="like_total">Лайки</option>
                    <option value="date_created">Дата</option>
                    <option value="dislike_total">Дизлайки</option>
                </select>
                <select id="sort" name="sort">
                    <option value="DESC">за зменшенням</option>
                    <option value="ASC">за збільшенням</option>
                </select>
            </div>

            <h2>Фільтри</h2>
            <div className={'select-box'}>
                <label htmlFor={'is_active'}>Активні пости</label>
                <select id="is_active" name="is_active">
                    <option value="1">Так</option>
                    <option value="0">Ні</option>
                </select>
            </div>
            <div className={'select-box'}>
                <label htmlFor="date_from">Дата від:</label>
                <input type={'date'} name={'date_from'} id={'date_from'}/>
            </div>
            <div className={'select-box'}>
                <label htmlFor="date_to">Дата до:</label>
                <input type={'date'} name={'date_to'} id={'date_to'}/>
            </div>
            <button onClick={update_with_save}>Примінити</button>
        </div>
    );
}

export default MainMenu;
