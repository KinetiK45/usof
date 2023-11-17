const Response = require('../models/response');
const Comment = require('../models/comment');
const ERRORS = require('./Errors');
const CommentLike = require("../models/commentLike");

function checkCommentValid(comment_id, res, callback) {
    let comment = new Comment();
    comment.find({id: comment_id})
        .then((comments)=>{
            if (comments.length === 0){
                ERRORS.NOT_FOUND_ERROR(res, 'comment');
            }
            else {
                callback();
            }
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

async function get_comment_by_id(req, res) {
    try {
        const comment_id = req.params.comment_id;
        let comment = new Comment();
        let find_results = await comment.find({id: comment_id});
        if (find_results.length === 0)
            return ERRORS.NOT_FOUND_ERROR(res, 'comment');
        res.json(new Response(true, undefined, find_results[0]));
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function get_comment_likes_by_id(req, res) {
    try {
        const comment_id = req.params.comment_id;
        checkCommentValid(comment_id, res, async () => {
            let comment_like = new CommentLike();
            const likes_found = await comment_like.find_with_sort({
                comment_id: comment_id,
                field: req.headers.field ? req.headers.field : 'id',
                order: req.headers.order ? req.headers.order : 'DESC',
                size: 100,
                page: req.headers.page ? req.headers.page : 1
            })
            res.json(new Response(true, undefined, likes_found));
        });
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function comment_like(req, res) {
    try {
        const comment_id = req.params.comment_id;

        let comment = new Comment();
        let find_results = await comment.find({id: comment_id});

        if (find_results.length === 0)
            return ERRORS.NOT_FOUND_ERROR(res, 'comment');

        if (req.senderData.id === find_results[0].creator_id)
            return ERRORS.SELF_LIKE(res);

        let commentLike = new CommentLike();
        commentLike.setData(comment_id, req.senderData.id);
        await commentLike.insert();
        res.json(new Response(true, 'Success'));
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function edit_comment(req, res) {
    try {
        const comment_id = req.params.comment_id;

        let comment = new Comment();
        let find_results = await comment.find({id: comment_id});

        if (find_results.length === 0)
            return ERRORS.NOT_FOUND_ERROR(res, 'comment');

        if (req.senderData.id !== find_results[0].creator_id)
            return ERRORS.ACCESS_DENIED(res);

        const content_upd = req.headers.content;
        let data = {id: comment_id, content: content_upd}
        await comment.updateById(data);
        res.json(new Response(true, 'Success'));
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function delete_comment(req, res) {
    try {
        const comment_id = req.params.comment_id;

        let comment = new Comment();
        let find_results = await comment.find({id: comment_id});

        if (find_results.length === 0)
            return ERRORS.NOT_FOUND_ERROR(res, 'comment');

        if (req.senderData.id !== find_results[0].creator_id && req.senderData.role !== 'admin')
            return ERRORS.ACCESS_DENIED(res);

        await comment.delete({id: comment_id});
        res.json(new Response(true, 'Success'));
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}

async function delete_comment_like(req, res) {
    try {
        const comment_id = req.params.comment_id;
        let commentLike = new CommentLike();
        const condition =
            {
                comment_id: comment_id,
                user_id: req.senderData.id
            };
        console.log(condition);
        const likes_found = await commentLike.find(condition);
        if (likes_found.length === 0)
            return ERRORS.NOT_FOUND_ERROR(res, 'like');
        await commentLike.delete({id: likes_found[0].id});
        res.json(new Response(true, 'Success'));
    } catch (error) {
        res.json(new Response(false, error.toString()))
    }
}


module.exports = {
    get_comment_by_id,
    get_comment_likes_by_id,
    comment_like,
    edit_comment,
    delete_comment,
    delete_comment_like
}