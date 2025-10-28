<?php
class UserController extends Controller {
    public function __construct() {
        parent::__construct();
        $this->call->model("UserModel");

        // Allow frontend (Vite/React) access
        header("Access-Control-Allow-Origin: http://localhost:5173");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Content-Type: application/json");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }

    // Get all users
    public function index() {
        $users = $this->UserModel->all();
        echo json_encode($users);
    }

    //  Get single user by ID
    public function get_user($id) {
        $user = $this->UserModel->get_user($id);
        echo json_encode($user);
    }

    // Create a new user
public function create() {
  // Handle file upload
$profilePic = $_POST['profile_pic_old'] ?? null;

if (!empty($_FILES['profile_pic']['name'])) {
    // Ensure the uploads directory exists inside public
    $uploadDir = ROOT_DIR . 'public/uploads/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generate a unique filename
    $filename = time() . "_" . basename($_FILES['profile_pic']['name']);
    $target = $uploadDir . $filename;

    // Move the uploaded file to the target directory
    if (move_uploaded_file($_FILES['profile_pic']['tmp_name'], $target)) {
        // URL that React can access
        $profilePic = "http://localhost:3000/public/uploads/" . $filename;
    }
}


    $this->UserModel->insert([
        'first_name'   => $_POST['first_name'] ?? '',
        'last_name'    => $_POST['last_name'] ?? '',
        'email'        => $_POST['email'] ?? '',
        'role'         => $_POST['role'] ?? 'Member',
        'job_title'    => $_POST['job_title'] ?? '',
        'profile_pic'  => $profilePic,
        'status'       => $_POST['status'] ?? 'Active',
        'last_active'  => date('Y-m-d'),
        'created_at'   => date('Y-m-d H:i:s'),
        'updated_at'   => date('Y-m-d H:i:s')
    ]);

    echo json_encode(['message' => 'User added successfully']);
}

public function update($id) {
$profilePic = $_POST['profile_pic_old'] ?? null;

if (!empty($_FILES['profile_pic']['name'])) {
    $uploadDir = ROOT_DIR . 'public/uploads/';
    if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

    $filename = time() . "_" . basename($_FILES['profile_pic']['name']);
    $target = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['profile_pic']['tmp_name'], $target)) {
        $profilePic = "http://localhost:3000/public/uploads/" . $filename;
    }
}

    $this->UserModel->update($id, [
        'first_name'   => $_POST['first_name'] ?? '',
        'last_name'    => $_POST['last_name'] ?? '',
        'email'        => $_POST['email'] ?? '',
        'role'         => $_POST['role'] ?? '',
        'job_title'    => $_POST['job_title'] ?? '',
        'profile_pic'  => $profilePic,
        'status'       => $_POST['status'] ?? '',
        'last_active'  => $_POST['last_active'] ?? date('Y-m-d'),
        'updated_at'   => date('Y-m-d H:i:s')
    ]);

    echo json_encode(['message' => 'User updated successfully']);
}

    //  Delete a user
    public function delete($id) {
        $this->UserModel->delete($id);
        echo json_encode(['message' => 'User deleted successfully']);
    }
}
