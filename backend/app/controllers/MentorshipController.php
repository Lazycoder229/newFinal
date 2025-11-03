<?php
class MentorshipController extends Controller {
    public function __construct() {
        parent::__construct();
        $this->call->model("MentorshipModel");
        
        header("Access-Control-Allow-Origin: http://localhost:5173");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Content-Type: application/json");
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }

    // Get all mentorships (Admin)
    public function index() {
        $mentorships = $this->MentorshipModel->all();
        echo json_encode($mentorships);
    }

    // Get mentorships for a specific user
    public function user($id) {
        $mentorships = $this->MentorshipModel->where("mentor_id = ? OR mentee_id = ?", [$id, $id]);
        echo json_encode($mentorships);
    }

    // Apply as mentee (user applies to a mentor)
    public function apply() {
        $data = $_POST;

        if (empty($data['mentor_id']) || empty($data['mentee_id'])) {
            echo json_encode(['error' => 'mentor_id and mentee_id are required']);
            return;
        }

        $data['status'] = 'Pending'; // default status for application
        $data['start_date'] = $data['start_date'] ?? date('Y-m-d');

        $this->MentorshipModel->insert($data);
        echo json_encode(['message' => 'Application submitted successfully']);
    }

 public function add() {
    // Read JSON from request body
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['mentor_id']) || empty($data['mentee_id'])) {
        echo json_encode(['error' => 'mentor_id and mentee_id are required']);
        return;
    }

    $data['status'] = $data['status'] ?? 'Active';
    $data['start_date'] = $data['start_date'] ?? date('Y-m-d');
    $data['end_date'] = $data['end_date'] ?? null;

    $this->MentorshipModel->insert($data);

    echo json_encode(['message' => 'Mentorship added successfully']);
}
    public function update($mentorship_id) {
    // Read JSON from request body
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
$updateData = [
    'mentor_id'   => $data['mentor_id'] ?? null,
    'mentee_id'   => $data['mentee_id'] ?? null,
    'title'       => $data['title'] ?? null,
    'description' => $data['description'] ?? null,
    'status'      => $data['status'] ?? null,
    'start_date'  => $data['start_date'] ?? null,
    'end_date'    => $data['end_date'] ?? null
];

$validStatuses = ['Active', 'Pending', 'Completed', 'Reject'];

// Use isset() instead of !empty()
if (isset($updateData['status']) && !in_array($updateData['status'], $validStatuses)) {
    echo json_encode(['error' => 'Invalid status']);
    return;
}

// Remove only null values (keep empty strings if any)
$updateData = array_filter($updateData, fn($v) => $v !== null);

// Update
$this->MentorshipModel->update($mentorship_id, $updateData);

echo json_encode(['message' => 'Mentorship updated successfully']);

}


    // Delete mentorship
    public function delete($mentorship_id) {
        $this->MentorshipModel->delete($mentorship_id);
        echo json_encode(['message' => 'Mentorship deleted successfully']);
    }

    // Get single mentorship by ID
    public function get_mentorship($mentorship_id) {
        $mentorship = $this->MentorshipModel->get_mentorship($mentorship_id);
        echo json_encode($mentorship);
    }
}
