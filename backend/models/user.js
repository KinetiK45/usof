const Model = require('./model');

class User extends Model{
    constructor() {
        super('users');
    }

    setData(login, email, password, nickname, photo = 'default.png', status = null, role='user'){
        this.login = login;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.photo = photo;
        this.status = status;
        this.role = role;
    }

    registration(login, password, email){
        this.login = login;
        this.email = email;
        this.password = password;
        return this.insert();
    }

    creation(login, password, email, role='user'){
        this.login = login;
        this.email = email;
        this.password = password;
        this.role = role;
        return this.insert();
    }
}

module.exports = User;
