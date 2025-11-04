<?php
class ForumModel extends Model {

    protected $table = 'forum_threads';
    protected $primary_key = 'thread_id';

    // Get all threads with usernames
    public function allWithUsers() {
        return $this->db
                    ->table('forum_threads AS f')
                    ->select('f.*, u.username AS created_by_name')
                    ->join('users AS u', 'f.created_by', '=', 'u.id')
                    ->orderBy('f.created_at', 'DESC')
                    ->get();
    }

    // Get single thread with username
public function getWithUsers($thread_id) {
    return $this->db
                ->table('forum_replies AS r')
                ->select('r.*, u.username AS user_name')
                ->left_join('users AS u', 'r.user_id = u.id')
                ->where('r.thread_id', $thread_id)
                ->order_by('r.created_at', 'ASC')
                ->get_all();
}

}

