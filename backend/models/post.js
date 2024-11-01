const Model = require('./model');

class Post extends Model {
    constructor() {
        super('posts');
    }

    setData(creatorId, title, content, is_active = true) {
        this.creator_id = creatorId;
        this.title = title;
        this.content = content;
        this.is_active = is_active;
    }
}

module.exports = Post;
