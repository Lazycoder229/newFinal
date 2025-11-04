<?php
class ForumController extends Controller {
    public function __construct() {
        parent::__construct();

        // Load models
        $this->call->model("ForumModel");
        $this->call->model("ForumReplyModel");

        // CORS + Headers
        header("Access-Control-Allow-Origin: http://localhost:5173");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Content-Type: application/json");

        // Handle preflight request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }

    // ---------- THREADS CRUD ----------

    // GET /api/forum/threads
 public function threads() {
    $threads = $this->ForumModel->all(); // joins users to get created_by_name
    echo json_encode($threads);
}

 public function reply() {
        $reply = $this->ForumReplyModel->all();
        echo json_encode($reply);
    }
     public function get_replies($reply_id) {
    $reply = $this->ForumReplyModel->find($reply_id);

    if (!$reply) {
        http_response_code(404);
        echo json_encode(['error' => 'Reply not found']);
        return;
    }

    echo json_encode([
        'reply_id' => $reply['reply_id'],
        'thread_id' => $reply['thread_id'],
        'user_id' => $reply['user_id'],
        'content' => $reply['content'],
        'created_at' => $reply['created_at'],
    ]);
}

public function get_thread($thread_id) {
    $thread = $this->ForumModel->find($thread_id);

    if (!$thread) {
        http_response_code(404);
        echo json_encode(['error' => 'Thread not found']);
        return;
    }

    // Direct query
    $replies = $this->ForumReplyModel
        ->db
        ->table('forum_replies')
        ->where('thread_id', $thread_id)
        ->get_all();

    echo json_encode([
        'thread_id'       => $thread['thread_id'],
        'title'           => $thread['title'],
        'content'         => $thread['content'],
        'created_by'      => $thread['created_by'],
        'created_by_name' => $thread['created_by_name'] ?? 'Unknown',
        'created_at'      => $thread['created_at'],
        'group_id'        => $thread['group_id'],
        'replies'         => $replies,
    ]);
}     
   public function create_thread() {
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
    if (empty($data['title']) || empty($data['content']) || empty($data['created_by'])) {
        echo json_encode(['error' => 'title, content, and created_by are required']);
        http_response_code(400);
        return;
    }

    // Optional: allow threads to belong to a group
    $data['group_id'] = $data['group_id'] ?? null;

    // Set default created_at
    $data['created_at'] = date('Y-m-d H:i:s');

    // Insert into database
    $thread_id = $this->ForumModel->insert($data);

    if ($thread_id) {
        echo json_encode([
            'message' => 'Thread created successfully',
            'thread_id' => $thread_id
        ]);
    } else {
        echo json_encode(['error' => 'Failed to create thread']);
        http_response_code(500);
    }
}


    // DELETE /api/forum/thread/:id
    public function delete_thread($thread_id) {
        $result = $this->ForumModel->delete($thread_id);

        if ($result) {
            echo json_encode(['message' => 'Thread deleted successfully']);
        } else {
            echo json_encode(['error' => 'Failed to delete thread']);
            http_response_code(500);
        }
    }

    // ---------- REPLIES CRUD ----------

    // POST /api/forum/reply
    public function create_reply() {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if ($data === null) {
            echo json_encode(['error' => 'Invalid JSON']);
            http_response_code(400);
            return;
        }

        if (empty($data['thread_id']) || empty($data['user_id']) || empty($data['content'])) {
            echo json_encode(['error' => 'thread_id, user_id, and content are required']);
            http_response_code(400);
            return;
        }

        $data['created_at'] = date('Y-m-d H:i:s');

        $reply_id = $this->ForumReplyModel->insert($data);

        if ($reply_id) {
            echo json_encode([
                'message' => 'Reply added successfully',
                'reply_id' => $reply_id
            ]);
        } else {
            echo json_encode(['error' => 'Failed to add reply']);
            http_response_code(500);
        }
    }


    // DELETE /api/forum/reply/:id
    public function delete_reply($reply_id) {
        $result = $this->ForumReplyModel->delete($reply_id);

        if ($result) {
            echo json_encode(['message' => 'Reply deleted successfully']);
        } else {
            echo json_encode(['error' => 'Failed to delete reply']);
            http_response_code(500);
        }
    }
}
