<?php
class GroupController extends Controller {
    public function __construct() {
        parent::__construct();
        $this->call->model("GroupModel");
        $this->call->model("GroupMemberModel");

        header("Access-Control-Allow-Origin: http://localhost:5173");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Content-Type: application/json");

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }

    // ---------- Groups CRUD ----------
    public function index() {
        $groups = $this->GroupModel->all();
        echo json_encode($groups);
    }

   public function create() {
    // Get the raw JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Check if JSON decoding worked
    if ($data === null) {
        echo json_encode(['error' => 'Invalid JSON']);
        http_response_code(400);
        return;
    }

    // Validate required fields
    if (empty($data['group_name']) || empty($data['created_by'])) {
        echo json_encode(['error' => 'group_name and created_by are required']);
        http_response_code(400);
        return;
    }

    // Set optional and default fields
    $data['description'] = $data['description'] ?? null;
    $data['created_at'] = date('Y-m-d H:i:s');

    // Insert into database using your model
    $group_id = $this->GroupModel->insert($data);

    if ($group_id) {
        echo json_encode([
            'message' => 'Group created successfully',
            'group_id' => $group_id
        ]);
    } else {
        echo json_encode(['error' => 'Failed to create group']);
        http_response_code(500);
    }
}

    public function update($group_id) {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];

        $updateData = [
            'group_name' => $data['group_name'] ?? null,
            'description' => $data['description'] ?? null
        ];

        // remove null values
        $updateData = array_filter($updateData, fn($v) => $v !== null);

        $this->GroupModel->update($group_id, $updateData);
        echo json_encode(['message' => 'Group updated successfully']);
    }

    public function delete($group_id) {
        $this->GroupModel->delete($group_id);
        echo json_encode(['message' => 'Group deleted successfully']);
    }

    // ---------- Group Members CRUD ----------
    public function all_members() {
        $members = $this->GroupMemberModel->all();
        echo json_encode($members);
    }


// Get single member by group_member_id
public function get_member($group_member_id) {
    $member = $this->GroupMemberModel->get($group_member_id); 
    echo json_encode($member);
}

    public function add_member() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['group_id']) || empty($data['id'])) {
            echo json_encode(['error' => 'group_id and id are required']);
            return;
        }

        $data['role'] = $data['role'] ?? 'Member';
        $data['joined_at'] = date('Y-m-d H:i:s');

        $member_id = $this->GroupMemberModel->insert([
            'group_id' => $data['group_id'],
            'user_id' => $data['id'],
            'role' => $data['role'],
            'joined_at' => $data['joined_at']
        ]);

        echo json_encode(['message' => 'Member added successfully', 'group_member_id' => $member_id]);
    }

    // Update a member
public function update_member($group_member_id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $role = $data['role'] ?? 'Member';
    $this->GroupMemberModel->update($group_member_id, ['role' => $role]);
    echo json_encode(['message' => 'Member role updated successfully']);
}

// Remove a member
public function remove_member($group_member_id) {
    $this->GroupMemberModel->delete($group_member_id);
    echo json_encode(['message' => 'Member removed successfully']);
}
}
