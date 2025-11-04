<?php


    // Get all replies for a thread with usernames
class ForumReplyModel extends Model {
    protected $table = 'forum_replies';
    protected $primary_key = 'reply_id';

    public function getWithUsers($thread_id) {
        return $this->db
                    ->table('forum_replies AS r')
                    ->select('r.*, u.username AS user_name')
                    ->join('users AS u', 'r.user_id', '=', 'u.id')
                    ->where('r.thread_id', $thread_id)
                    ->orderBy('r.created_at', 'ASC')
                    ->get();
    }
}
