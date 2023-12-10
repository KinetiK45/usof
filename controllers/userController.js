const User = require('../models/user');
const Response = require('../models/response');
const fs = require('fs');
const path = require("path");
const {ACCESS_DENIED} = require("./Errors");
async function users_all(req, res) {
    try {
        let user = new User();
        const users_found = await user.find_with_sort({
            field: req.headers.field ? req.headers.field : 'id',
            order: req.headers.order ? req.headers.order : 'ASC',
            size: 50,
            page: req.headers.page ? req.headers.page : 1
        })
        res.json(new Response(true, undefined, users_found));
    }catch (e){
        res.json(new Response(false, e.toString()))
    }
}

async function users_user_id(req, res) {
    const user_id = req.params.user_id;
    let user = new User();
    user.find({id: user_id})
        .then((users)=>{
            if (users.length === 0){
                res.json(new Response(false, 'Пользователя с таким id не найдено!'))
            }
            else
                res.json(new Response(true, undefined, users[0]));
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

async function users_creation(req, res) {
    const {login, password, email, role} = req.body;
    let user = new User();
    user.creation(login, password, email, role)
        .then((result)=>{
            user.find({id: result})
                .then((registered_data)=>{
                    res.json(new Response(true, undefined, registered_data[0]));
                })
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

async function avatar_upload(req, res) {
    if (!req.file) {
        return res.json(new Response(false, 'Ошибка загрузки файла!'));
    }
    const photo = req.file;
    const account_id = Number.parseInt(req.headers.account_id);
    if (!account_id)
        return res.json(new Response(false, 'Не указан id аккаунта!'));
    if (account_id !== req.senderData.id && req.senderData.role !== 'admin')
        return res.json(new Response(false, 'Access denied!'));
    const filename = photo.filename.toString().toLowerCase();
    if (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg')){
        let user = new User();
        user.find({id: account_id}).then((results) => {
            let userdata = results[0];
            userdata.photo = photo.filename;
            console.log(userdata);
            user.updateById(userdata).then(() => {
                res.json(new Response(true, 'Фото успешно обновлено'));
            })
                .catch((error)=> {
                    res.json(new Response(false, error.toString()))
                })
        }).catch((error) => {
            res.json(new Response(false, `Не найдено аккаунта с id ${account_id}`))
        })
    }
    else {
        res.json(new Response(false, 'Данный тип изображения не поддерживается'));
        fs.unlink(photo.path, (err) => {
            if (err) {
                console.error(`Ошибка при удалении файла: ${err}`);
            }
        });
    }
}

async function user_edit(req, res) {
    try {
        const user_id = Number.parseInt(req.params.user_id);
        if (user_id !== req.senderData.id && req.senderData.role !== 'admin'){
            return ACCESS_DENIED(res);
        }
        const new_data = req.body.data;
        let user = new User();
        user.find({id: user_id}).then(async (result) => {
            if (result.length === 0)
                res.json(new Response(false, 'Похоже пользователя с таким id не существует'));
            else {
                new_data.id = user_id;
                user.updateById(new_data).then(()=>{
                    res.json(new Response(true, 'Данные оновлены'));
                });
            }
        })
            .catch((error)=>{
                return res.json(new Response(false, error.toString()));
            });
    } catch (error){
        res.json(new Response(false, 'Что-то пошло не так'));
    }
}

async function user_delete(req, res) {
    const user_id = req.params.user_id;
    let user = new User();
    user.find({id: user_id}).then((results)=>{
        if (results.length === 0)
            return res.json(new Response(false, 'Похоже пользователя с таким id не существует'));
        user.delete({id: user_id}).then(()=>{
            res.json(new Response(true, 'Пользователь удален'));
        }).catch((error)=>{
            res.json(new Response(false, error.toString()));
        })
    }).catch((error)=>{
        return res.json(new Response(false, error.toString()));
    });
}

async function user_avatar(req, res) {
    const user_id = req.params.user_id;
    let user = new User();
    user.find({id: user_id})
        .then((users)=>{
            if (users.length === 0){
                res.json(new Response(false, 'Пользователя с таким id не найдено!'))
            }
            else{
                let filename = users[0].photo
                const filePath = path.join(__dirname, '../images', filename);
                res.sendFile(filePath);
            }
        }).catch((error)=>{
        res.json(new Response(false, error.toString()))
    });
}

module.exports = {
    users: users_all,
    users_user_id,
    users_creation,
    avatar_upload,
    user_edit,
    user_delete,
    user_avatar
}