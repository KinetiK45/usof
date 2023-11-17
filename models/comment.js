const Model = require('./model');

class Comment extends Model {
    constructor() {
        super('comments');
    }

    setData(creatorId, content, parentPostId, is_active = true) {
        this.creator_id = creatorId;
        this.content = content;
        this.parent_post_id = parentPostId;
        this.is_active = is_active;
    }
}

module.exports = Comment;
