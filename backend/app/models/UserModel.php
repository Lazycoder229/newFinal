<?php
class UserModel extends Model {
    protected $table = 'users';
    protected $primary_key = 'id';

    public function get_all_users() {
        return $this->db->table($this->table)->get_all();
    }

    public function get_users($id) {
        return $this->db->table($this->table)->where('id', $id)->get();
    }

    public function create_users($data) {
        return $this->db->table($this->table)->insert($data);
    }

    public function update_users($id, $data) {
        return $this->db->table($this->table)->where('id', $id)->update($data);
    }

    public function delete_users($id) {
        return $this->db->table($this->table)->where('id', $id)->delete();
    }
}
