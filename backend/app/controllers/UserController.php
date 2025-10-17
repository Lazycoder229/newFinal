<?php
class UserController extends Controller {
   public function __construct() {
    parent::__construct();
    $this->call->model("UserModel");

    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Content-Type: application/json");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}


    public function index() {
        $users = $this->UserModel->get_all_users();
        echo json_encode($users);
    }

    public function get_users($id) {
        $user = $this->UserModel->get_users($id);
        echo json_encode($user);
    }

    public function create() {
        $data = json_decode(file_get_contents("php://input"), true);
        $this->UserModel->create_users([
            'name' => $data['name'],
            'email' => $data['email'],
            'created_at' => date('Y-m-d H:i:s')
        ]);
        echo json_encode(['message' => 'User added successfully']);
    }

    public function update($id) {
        $data = json_decode(file_get_contents("php://input"), true);
        $this->UserModel->update_users($id, [
            'name' => $data['name'],
            'email' => $data['email'],
            'updated_at' => date('Y-m-d H:i:s')
        ]);
        echo json_encode(['message' => 'User updated successfully']);
    }

    public function delete($id) {
        $this->UserModel->delete_users($id);
        echo json_encode(['message' => 'User deleted successfully']);
    }
}
