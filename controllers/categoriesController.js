const Response = require('../models/response');
const PostCategory = require('../models/postCategory');
const ERRORS = require('./Errors');
const Category = require("../models/category");

async function checkCategoryValid(category_id, res, callback) {
    try {
        let category = new Category();
        let categories_found = await category.find({id: category_id});
        if (categories_found.length === 0)
            return ERRORS.NOT_FOUND_ERROR(res, 'категория');
        callback();
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function get_all(req, res) {
    try {
        let category = new Category();
        let categories = await category.find({});
        res.json(new Response(true, undefined, categories));
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function category_by_id(req, res) {
    try {
        const category_id = req.params.category_id;
        let category = new Category();
        let categories_found = await category.find({id: category_id});
        if (categories_found.length === 0)
            return ERRORS.NOT_FOUND_ERROR(res, 'категория');
        res.json(new Response(true, undefined, categories_found[0]));
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function posts_by_category(req, res) {
    try {
        const category_id = req.params.category_id;
        await checkCategoryValid(category_id, res, async () => {
            let postCategory = new PostCategory();
            let posts_categories_found = await postCategory.find({category_id: category_id});
            const postIds = posts_categories_found.map(item => item.post_id);
            res.json(new Response(true, undefined, postIds.sort((a, b) => b - a)));
        })
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function create_category(req, res) {
    try {
        if (req.senderData.role !== 'admin')
            return  ERRORS.ACCESS_DENIED(res);
        const title = req.headers.title;
        let category = new Category();
        category.setData(title, req.headers.description ? req.headers.description : '...');
        await category.insert();
        res.json(new Response(true, 'Success'));
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function edit_category(req, res) {
    try {
        if (req.senderData.role !== 'admin')
            return  ERRORS.ACCESS_DENIED(res);
        const category_id = req.params.category_id;
        await checkCategoryValid(category_id, res, async () => {
            let category = new Category();
            let updated_data = {id: category_id};
            if (req.headers.title)
                updated_data.title = req.headers.title;
            if (req.headers.description)
                updated_data.description = req.headers.description;
            await category.updateById(updated_data);
            res.json(new Response(true, 'Success'));
        })
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function delete_category(req, res) {
    try {
        if (req.senderData.role !== 'admin')
            return ERRORS.ACCESS_DENIED(res);
        const category_id = req.params.category_id;
        await checkCategoryValid(category_id, res,async () => {
            let category = new Category();
            await category.delete({id: category_id});
            res.json(new Response(true, 'Success'));
        })
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

module.exports = {
    get_all,
    category_by_id,
    posts_by_category,
    create_category,
    edit_category,
    delete_category
}