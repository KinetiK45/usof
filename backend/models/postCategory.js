const Model = require('./model');

class PostCategory extends Model {
    constructor() {
        super('post_categories');
    }

    setData(postId, categoryId) {
        this.post_id = postId;
        this.category_id = categoryId;
    }
}

module.exports = PostCategory;
