const Response = require("../models/response");
const NOT_FOUND_ERROR = (res, target) => {
    res.json(new Response(false, `Этот ${target} был удален либо его не существовало`));
}

const ACCESS_DENIED = (res) => {
    res.json(new Response(false, `У вас нет права для выполнения этого действия`));
}

const SELF_LIKE = (res) => {
    res.json(new Response(false, 'Мы знаем что вам нравиться то что вы пишите'));
}

const DATE_TYPE_ERROR = (res, bad_date) => {
    res.json(new Response(false, `Неправильный формат даты ${bad_date}`));
}

module.exports = {
    NOT_FOUND_ERROR,
    ACCESS_DENIED,
    SELF_LIKE,
    DATE_TYPE_ERROR
}