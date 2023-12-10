const Post = require('../models/post');
const Response = require('../models/response');
const Comment = require('../models/comment');
const PostCategory = require('../models/postCategory');
const PostLike = require('../models/postLike');
const ERRORS = require('./Errors');
const Category = require("../models/category");
const CommentLike = require("../models/commentLike");

function checkPostValid(post_id, res, callback) {
    let post = new Post();
    post.find({id: post_id})
        .then((posts)=>{
            if (posts.length === 0){
                ERRORS.NOT_FOUND_ERROR(res, 'пост');
            }
            else {
                callback();
            }
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

async function editCategories(req, res, callback) {
    try {
        const {categories} = req.body;
        const post_id = req.params.post_id;

        if (Array.isArray(categories) && categories.length > 0) {
            let category = new Category();
            const results = await category.find({});
            let idArray = results.map(item => item.id);

            if (!categories.every(id => idArray.includes(id))) {
                return ERRORS.NOT_FOUND_ERROR(res, 'категория');
            }

            let postCategory = new PostCategory();
            await postCategory.delete({post_id: post_id});

            for (let categoriesKey of categories) {
                let post_n = new PostCategory();
                post_n.setData(post_id, categoriesKey);
                await post_n.insert();
            }
        }

        callback();
    } catch (error) {
        callback();
    }
}

async function get_all_posts(req, res) {
    try {
        let post = new Post();
        const order = req.headers.order ? req.headers.order : 'DESC';
        const field = req.headers.field ? req.headers.field : 'like_total';
        const page = req.headers.page ? Number.parseInt(req.headers.page) : 1;
        let join = '';
        let group = ''
        const filters = [];
        if (req.headers.date_from){
            if (isNaN(Date.parse(req.headers.date_from)))
                return ERRORS.DATE_TYPE_ERROR(res, req.headers.date_from);
            filters.push(`date_created > "${req.headers.date_from}"`);
        }
        if (req.headers.date_to){
            if (isNaN(Date.parse(req.headers.date_to)))
                return ERRORS.DATE_TYPE_ERROR(res, req.headers.date_to);
            filters.push(`date_created < "${req.headers.date_to}"`);
        }
        if (req.headers.is_active){
            filters.push(`is_active = "${req.headers.is_active}"`);
        }
        if (req.headers.categories){
            let category_ids = JSON.parse(req.headers.categories);
            if (category_ids.length !== 0){
                join = 'SELECT p.*, GROUP_CONCAT(pc.category_id) AS category_ids FROM posts p JOIN post_categories pc ON p.id = pc.post_id';
                group = `GROUP BY p.id HAVING COUNT(DISTINCT CASE WHEN pc.category_id IN (${category_ids.join(', ')}) THEN pc.category_id END) = ${category_ids.length}`;
            }
        }
        let posts_found = await post.find_with_sort({
            join: join,
            group: group,
            field: field,
            order: order,
            size: 20,
            page: page,
            filters: filters
        });
        res.json(new Response(true, undefined, posts_found));
    } catch (error){
        console.log(`error: ${error}`);
        res.json(new Response(false, error.toString()))
    }
}

async function posts_post_id(req, res) {
    const post_id = req.params.post_id;
    let post = new Post();
    post.find({id: post_id})
        .then((posts)=>{
            if (posts.length === 0){
                ERRORS.NOT_FOUND_ERROR(res, 'пост');
            }
            else
                res.json(new Response(true, undefined, posts[0]));
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

async function post_comments_all(req, res) {
    try {
        const post_id = req.params.post_id;
        checkPostValid(post_id, res,
            async () => {
                let comment = new Comment();
                let comments_found = await comment.find_with_sort({
                    parent_post_id: post_id,
                    field: req.headers.field ? req.headers.field : 'id',
                    order: req.headers.order ? req.headers.order : 'ASC',
                    size: 20,
                    page: req.headers.page ? req.headers.page : 1
                });
                res.json(new Response(true, undefined, comments_found));
            });
    }
    catch (e){
        res.json(new Response(false, e.toString()));
    }
}

async function create_post_comment(req, res) {
    const post_id = Number.parseInt(req.params.post_id);
    const content = req.body.content;
    checkPostValid(post_id, res,
        ()=>{
            let comment = new Comment();
            comment.setData(req.senderData.id, content, post_id);
            comment.insert().then((result)=>{
                res.json(new Response(true, `Комментарий ${result} успешно создан`))
            }).catch((error)=>{
                res.json(new Response(false, 'Что-то пошло не так'));
            })
        });
}

async function get_categories(req, res) {
    const post_id = req.params.post_id;
    checkPostValid(post_id, res,
        ()=>{
            let postCategory = new PostCategory();
            postCategory.find({post_id: post_id}).then((results)=>{
                res.json(new Response(true, undefined, results));
            }).catch((error)=>{
                res.json(new Response(false, error.toString()));
            })
        });
}

async function get_post_likes(req, res) {
    try {
        const post_id = req.params.post_id;
        checkPostValid(post_id, res,
            async () => {
                let postLike = new PostLike();

                let conditions = {
                    post_id: post_id,
                    field: req.headers.field ? req.headers.field : 'id',
                    order: req.headers.order ? req.headers.order : 'DESC',
                    size: 100,
                    page: req.headers.page ? req.headers.page : 1
                }

                if (req.headers.user_id)
                    conditions.user_id = req.headers.user_id;

                const likes_found = await postLike.find_with_sort(conditions);
                res.json(new Response(true, undefined, likes_found));
            });
    }catch (e){
        res.json(new Response(false, e.toString()));
    }
}

async function create_post(req, res) {
    const creator_id = req.senderData.id;
    const {categories, title, content} = req.body;
    let post = new Post();
    post.setData(creator_id, title, content);
    post.insert().then((created_post_id)=>{
        categories.forEach((category)=>{
            let postCategory = new PostCategory();
            postCategory.setData(created_post_id, category);
            postCategory.insert();
        });
        res.json(new Response(true, 'Пост был создан успешно', {postid: created_post_id}));
    }).catch((error)=>{
        res.json(new Response(false, error.toString()));
    });
}

async function like_post(req, res) {
    const creator_id = req.senderData.id;
    const post_id = req.params.post_id;
    const value = req.body.value;

    let post = new Post();
    const posts = await post.find({id: post_id});
    if (posts.length === 0){
        return ERRORS.NOT_FOUND_ERROR(res, 'пост');
    }
    if (posts[0].creator_id === creator_id){
        return ERRORS.SELF_LIKE(res);
    }

    let postLike = new PostLike();
    let active_likes = await postLike.find({post_id: post_id, user_id: req.senderData.id});
    if (active_likes.length > 0) {
        await postLike.delete({id: active_likes[0].id});
    }

    postLike.setData(post_id, creator_id, value);
    postLike.insert().then(() => {
        res.json(new Response(true));
    }).catch((error) => {
        res.json(new Response(false, error.toString()))
    })
}

async function edit_post(req, res) {
    const post_id = req.params.post_id;
    let post = new Post();
    const {title, content, is_active, categories} = req.body;
    post.find({id: post_id})
        .then(async (posts) => {
            if (posts.length === 0) {
                ERRORS.NOT_FOUND_ERROR(res, 'пост');
            } else if (posts[0].creator_id !== req.senderData.id && req.senderData.role !== 'admin' && content !== undefined && title !== undefined && categories !== undefined) {
                ERRORS.ACCESS_DENIED(res);
            }
            else {
                const data_edit = () => {
                    let updated_data = {id: posts[0].id};
                    if (title)
                        updated_data.title = title;
                    if (content)
                        updated_data.content = content;
                    if (is_active !== undefined)
                        updated_data.is_active = is_active;
                    post.updateById(updated_data).then(() => {
                        res.json(new Response(true, 'Данные оновлены'));
                    }).catch((error) => {
                        res.json(new Response(false, error.toString()));
                    })
                };
                if (categories){
                    await editCategories(req, res, data_edit)
                }
                else
                    data_edit();
            }
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

async function delete_post(req, res) {
    try {
        const post_id = req.params.post_id;
        checkPostValid(post_id, res, ()=>{
            let post = new Post();
            post.delete({id: post_id}).then(
                ()=>res.json(new Response(true, 'Пост удален'))
            )
        })
    } catch (error) {
        res.json(new Response(false, error.toString()));
    }
}

async function delete_post_like(req, res) {
    try {
        const post_id = req.params.post_id;
        const like_holder_id = req.senderData.id;
        let postLike = new PostLike();
        let likes_found = await postLike.find({post_id: post_id, user_id: like_holder_id});
        if (likes_found.length === 0)
            return ERRORS.NOT_FOUND_ERROR(res, 'лайк');
        postLike.delete({post_id: post_id, user_id: like_holder_id}).then(
            ()=>res.json(new Response(true, 'Лайк удален'))
        )
    } catch (error) {
        res.json(new Response(false, error.toString()));
    }
}


module.exports = {
    posts: get_all_posts,
    posts_post_id,
    post_comments_all,
    create_post_comment,
    get_categories,
    get_post_likes,
    create_post,
    like_post,
    edit_post,
    delete_post,
    delete_post_like
}