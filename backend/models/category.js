const Model = require('./model');

class Category extends Model {
    constructor() {
        super('categories');
    }

    setData(title, description) {
        this.title = title;
        this.description = description;
    }
}

module.exports = Category;
