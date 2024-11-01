const Model = require('./model');

class PostLike extends Model {
    constructor() {
        super('post_likes');
    }

    setData(postId, userId, value = 1) {
        this.post_id = postId;
        this.user_id = userId;
        this.value = value;
    }
}

module.exports = PostLike;