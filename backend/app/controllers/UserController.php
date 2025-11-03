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

    // Get all users
    public function index() {
        $users = $this->UserModel->all();
        echo json_encode($users);
    }

    // Get single user by ID
    public function get_user($id) {
        $user = $this->UserModel->get_user($id);
        echo json_encode($user);
    }

    // Create a new user
    public function create() {
        // Validate required fields
        if (empty($_POST['first_name']) || empty($_POST['last_name']) || 
            empty($_POST['email']) || empty($_POST['username']) || 
            empty($_POST['password'])) {
            echo json_encode(['error' => 'Please fill all required fields']);
            return;
        }

        // Handle file upload
        $profileImage = null;
        if (!empty($_FILES['profile_image']['name'])) {
            $uploadDir = ROOT_DIR . 'public/uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $filename = time() . "_" . basename($_FILES['profile_image']['name']);
            $target = $uploadDir . $filename;
            
            if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $target)) {
                $profileImage = "http://localhost:3000/public/uploads/" . $filename;
            }
        }

        $this->UserModel->insert([
            'first_name'    => $_POST['first_name'],
            'last_name'     => $_POST['last_name'],
            'email'         => $_POST['email'],
            'username'      => $_POST['username'],
            'password_hash' => password_hash($_POST['password'], PASSWORD_BCRYPT),
            'skills'        => $_POST['skills'] ?? '',
            'role'          => $_POST['role'] ?? 'Mentee',
            'bio'           => $_POST['bio'] ?? null,
            'profile_image' => $profileImage,
            'date_joined'   => date('Y-m-d H:i:s'),
            'status'        => $_POST['status'] ?? 'Active'
        ]);
        
        echo json_encode(['message' => 'User added successfully']);
    }

    // Update user
    public function update($id) {
        // Get existing profile image if no new file uploaded
        $profileImage = $_POST['profile_image_old'] ?? null;
        
        if (!empty($_FILES['profile_image']['name'])) {
            $uploadDir = ROOT_DIR . 'public/uploads/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $filename = time() . "_" . basename($_FILES['profile_image']['name']);
            $target = $uploadDir . $filename;
            
            if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $target)) {
                $profileImage = "http://localhost:3000/public/uploads/" . $filename;
            }
        }

        $data = [
            'first_name'    => $_POST['first_name'] ?? '',
            'last_name'     => $_POST['last_name'] ?? '',
            'email'         => $_POST['email'] ?? '',
            'username'      => $_POST['username'] ?? '',
            'skills'        => $_POST['skills'] ?? '',
            'role'          => $_POST['role'] ?? 'Mentee',
            'bio'           => $_POST['bio'] ?? null,
            'profile_image' => $profileImage,
            'status'        => $_POST['status'] ?? 'Active'
        ];

        // Only update password if provided
        if (!empty($_POST['password'])) {
            $data['password_hash'] = password_hash($_POST['password'], PASSWORD_BCRYPT);
        }

        $this->UserModel->update($id, $data);
        
        echo json_encode(['message' => 'User updated successfully']);
    }

    // Delete a user
    public function delete($id) {
        $this->UserModel->delete($id);
        echo json_encode(['message' => 'User deleted successfully']);
    }
}