import axios from "axios";

const domain = 'http://192.168.1.4:3001/api';

function removeEmpty(obj) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => value !== '' && value !== null && value !== undefined)
    );
}

const axiosInstance = axios.create({
    baseURL: domain,
    headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
    }
});

export default class Requests {
    // AUTH
    static async registration(login, password, email){
        let obj = {login: login, password: password, email: email};
        const resp = await
            axiosInstance.post('/auth/register', obj);
        return resp.data;
    }
    static async login(login, password){
        let obj = {login:login, password:password};
        const resp = await
            axiosInstance.post('/auth/login', obj);
        return resp.data;
    }
    static async logout(){
        const resp = await
            axiosInstance.post('/auth/logout');
        return resp.data;
    }
    static async passwordResetCreate(email){
        let obj = {email:email};
        const resp = await
            axiosInstance.post('/auth/password-reset', obj);
        return resp.data;
    }
    static async passwordResetConfirm(confirm_token, password){
        let obj = {
            password: password
        };
        const resp = await
            axiosInstance.post(`/auth/password-reset/${confirm_token}`, obj);
        return resp.data;
    }

    // USER
    static async users_all(page = 1, order = 'ASC', field = 'id'){
        const config = {
            headers: {
                'field': field,
                'order': order,
                'page': page
            }
        };
        console.log(config.headers);
        const resp = await
            axiosInstance.get(`/users/`, config);
        return resp.data;
    }
    static async user_by_id(user_id){
        const resp = await
            axiosInstance.get(`/users/${user_id}`);
        return resp.data;
    }
    static async create_user(login, password, email, role = 'user'){
        let obj = {
            login: login,
            password: password,
            email: email,
            role: role
        };
        const resp = await
            axiosInstance.post(`/users/`, obj);
        return resp.data;
    }
    static async avatarUpload(file, account_id, token){
        const data = new FormData();
        data.append('photo', file);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'account_id': account_id,
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.patch(`/users/avatar`, data, config);
        return resp;
    }
    static get_img_link(user_id){
        return `${domain}/users/${user_id}/avatar`;
    }
    static async edit_user(edited_data, user_id, token){
        let obj = {
            data: edited_data,
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.patch(`/users/${user_id}`, obj, config);
        return resp.data;
    }
    static async delete_user(user_id){
        const resp = await
            axiosInstance.delete(`/users/${user_id}`);
        return resp.data;
    }

    // POST
    static async posts_all(headers){
        const config = {
            headers: removeEmpty(headers)
        };
        const resp = await
            axiosInstance.get(`/posts/`, config);
        return resp.data;
    }
    // static async posts_all(page = 1, order = 'DESC', field = 'like_total', categories = undefined, date_from = "", date_to = ""){
    //     const config = {
    //         headers: removeEmpty({
    //             'field': field,
    //             'order': order === 'DESC' ? order : 'ASC',
    //             'page': `${page}`,
    //             'categories': categories,
    //             'date_from': date_from,
    //             'date_to': date_to
    //         })
    //     };
    //     console.log(config);
    //     const resp = await
    //     axiosInstance.get(`/posts/`, config);
    //     console.log(resp.data);
    //     return resp.data;
    // }
    static async post_by_id(post_id){
        const resp = await
            axiosInstance.get(`/posts/${post_id}`);
        return resp.data;
    }
    static async post_comments_by_id(post_id, page = 1, order = 'ASC', field = 'id'){
        const config = {
            headers: {
                'field': field,
                'order': order === 'DESC' ? order : 'ASC',
                'page': `${page}`
            }
        };
        const resp = await
            axiosInstance.get(`/posts/${post_id}/comments`, config);
        return resp.data;
    }
    static async create_comment(post_id, content, token){
        let obj = {
            content: content
        };

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const resp = await
            axiosInstance.post(`/posts/${post_id}/comments`, obj, config);
        return resp.data;
    }
    static async get_post_categories(post_id){
        const resp = await
            axiosInstance.get(`/posts/${post_id}/categories`);
        return resp.data;
    }
    static async get_post_likes(post_id, page = 1, order = 'DESC', field = 'id', user_id){
        const config = {
            headers: {
                'field': field,
                'order': order === 'DESC' ? order : 'ASC',
                'page': `${page}`
            }
        };
        if (user_id)
            config.headers.user_id = user_id;
        const resp = await
            axiosInstance.get(`/posts/${post_id}/like`, config);
        return resp.data;
    }
    static async create_post(title, content, categories = [], token){
        let obj = {
            title: title,
            content: content,
            categories: categories
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.post(`/posts`, obj, config);
        return resp.data;
    }
    static async like_post(post_id, is_like = true, token){
        let obj = {
            value: is_like ? 1 : -1
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.post(`/posts/${post_id}/like`, obj, config);
        return resp.data;
    }
    static async edit_post(edited_data, post_id, token){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.patch(`/posts/${post_id}`, edited_data, config);
        return resp.data;
    }
    static async delete_post(post_id, token){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.delete(`/posts/${post_id}`, config);
        return resp.data;
    }
    static async delete_post_like(post_id, token){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.delete(`/posts/${post_id}/like`, config);
        return resp.data;
    }

    //COMMENT
    static async get_comment_by_id(comment_id){
        const resp = await
            axiosInstance.get(`/comments/${comment_id}`);
        return resp.data;
    }
    static async get_comment_likes(comment_id, page = 1, order = 'DESC', field = 'id', user_id){
        const config = {
            headers: {
                'field': field,
                'order': order === 'DESC' ? order : 'ASC',
                'page': `${page}`
            }
        };
        if (user_id)
            config.headers.user_id = user_id;
        const resp = await
            axiosInstance.get(`/comments/${comment_id}/like`, config);
        return resp.data;
    }
    static async like_comment(comment_id, is_like = true, token){
        let obj = {
            value: is_like ? 1 : -1
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.post(`/comments/${comment_id}/like`, obj, config);
        return resp.data;
    }
    static async edit_comment(content, comment_id, token){
        const obj = {
            content: content
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.patch(`/comments/${comment_id}`, obj, config);
        return resp.data;
    }
    static async delete_comment(comment_id, token){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const resp = await
            axiosInstance.delete(`/comments/${comment_id}`, config);
        return resp.data;
    }
    static async delete_comment_like(comment_id, token){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.delete(`/comments/${comment_id}/like`, config);
        return resp.data;
    }

    //CATEGORIES
    static async categories_all(){
        const resp = await
            axiosInstance.get(`/categories`);
        return resp.data;
    }
    static async get_category_by_id(category_id){
        const resp = await
            axiosInstance.get(`/categories/${category_id}`);
        return resp.data;
    }
    static async get_posts_by_category(category_id){
        const resp = await
            axiosInstance.get(`/categories/${category_id}/posts`);
        return resp.data;
    }
    static async create_category(title, description, token){
        let obj = {
            title: title,
            description: description
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.post(`/categories/`, obj, config);
        return resp.data;
    }
    static async edit_category(category_id, title, description, token){
        let obj = {
            title: title,
            description: description
        };
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.patch(`/categories/${category_id}`, obj, config);
        return resp.data;
    }
    static async delete_category(category_id, token){
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
        const resp = await
            axiosInstance.delete(`/categories/${category_id}`, config);
        return resp.data;
    }
}