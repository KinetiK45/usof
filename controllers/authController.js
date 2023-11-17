const User = require('../models/user');
const Response = require('../models/response');
const token_controller = require('../controllers/ApiTokenController');
const nodemailer = require("nodemailer");
const ERRORS = require('./Errors');


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'javawebtempmail@gmail.com',
        pass: 'ljgw wsww hvod tkpz'
    }
});

async function register(req, res) {
    const headers = req.headers;
    let user = new User();
    user.registration(headers.login, headers.password, headers.email)
        .then((result)=>{
            user.find({id: result})
                .then((registered_data)=>{
                    res.json(new Response(true, undefined, registered_data[0]));
                })
        }).catch((error)=>{
            res.json(new Response(false, error.toString()))
    });
}

async function login(req, res) {
    const headers = req.headers;
    let user = new User();
    user.find({login: headers.login}).then((usersFound)=>{
        if (usersFound.length === 0){
            res.json(new Response(false, 'Нет пользователя с такими данными'));
        }
        else if (usersFound[0].password === headers.password){
            res.json(new Response(true, 'Успешный вход', {auth_key: token_controller.generateToken(usersFound[0])}));
        }
        else
            res.json(new Response(false, 'Не правильный пароль!'));
    }).catch((error)=>{
        console.log(error)
        res.json(new Response(false, error.toString()))
    })
}

async function password_reset(req, res) {
    const email = req.headers.email;

    let user = new User();
    let find_results = await user.find({email: email});
    if (find_results.length === 0)
        return ERRORS.NOT_FOUND_ERROR(res, 'User');

    const token = token_controller.generateToken({login: find_results[0].login}, '10m');
    const link = `http://localhost:3000/api/auth/password-reset/${token}`;
    const mailOptions = {
        to: find_results[0].email,
        subject: 'Password reset',
        html: `<p>Dear user.</p>
<p>Your password recovery <a style="font-weight: bold" href="${link}">link</a></p>
<p style="color: red">You have 10 minutes to use it!</p>
<p>If you didn't do this, please ignore this message.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json(new Response(false, error.toString()));
        } else {
            res.json(new Response(true, 'Password recovery link was successfully send to your email'));
        }
    });
}

async function password_reset_confirmation(req, res) {
    const login = req.senderData.login;
    res.json(new Response(true, `Логин ${login}, тут будет страница с созданием нового пароля`));
}

module.exports = {
    register,
    login,
    password_reset,
    password_reset_confirmation
}