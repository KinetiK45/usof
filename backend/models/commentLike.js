const Model = require('./model');

class CommentLike extends Model {
    constructor() {
        super('comment_likes');
    }

    setData(commentId, userId, value = 1) {
        this.comment_id = commentId;
        this.user_id = userId;
        this.value = value;
    }
}

module.exports = CommentLike;
