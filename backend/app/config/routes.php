<?php
defined('PREVENT_DIRECT_ACCESS') OR exit('No direct script access allowed');
// Allow method override for forms and axios (_method)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_REQUEST['_method'])) {
    $_SERVER['REQUEST_METHOD'] = strtoupper($_REQUEST['_method']);
}

/**
 * ------------------------------------------------------------------
 * LavaLust - an opensource lightweight PHP MVC Framework
 * ------------------------------------------------------------------
 *
 * MIT License
 *
 * Copyright (c) 2020 Ronald M. Marasigan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @package LavaLust
 * @author Ronald M. Marasigan <ronald.marasigan@yahoo.com>
 * @since Version 1
 * @link https://github.com/ronmarasigan/LavaLust
 * @license https://opensource.org/licenses/MIT MIT License
 */

/*
| -------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------
| Here is where you can register web routes for your application.
|
|
*/
$router->get('/', function() {
    echo json_encode(['message' => 'API is running!']);
});


// USERS ROUTES
$router->get('/api/users', 'UserController::index');
$router->get('/api/users/{id}', 'UserController::get_user');    
$router->post('/api/users', 'UserController::create');
$router->put('/api/users/{id}', 'UserController::update');
$router->delete('/api/users/{id}', 'UserController::delete');
// Auth
$router->post('/api/auth/login', 'UserController::login');
// Track profile visits


// MENTORSHIP ROUTES
$router->get('/api/mentorships', 'MentorshipController::index');                // Get all mentorships
$router->get('/api/mentorships/{id}', 'MentorshipController::get_mentorship');   // Get single mentorship
$router->post('/api/mentorships', 'MentorshipController::add');                 // Create a new mentorship
$router->put('/api/mentorships/{id}', 'MentorshipController::update');          // Update mentorship
$router->delete('/api/mentorships/{id}', 'MentorshipController::delete');       // Delete mentorship
// ---------- GROUP ROUTES ----------

// Groups CRUD
$router->get('/api/groups', 'GroupController::index');                     // Get all groups
$router->get('/api/groups/{id}', 'GroupController::get_group');           // Get single group
$router->post('/api/groups', 'GroupController::create');                  // Create a new group
$router->put('/api/groups/{id}', 'GroupController::update');              // Update group
$router->delete('/api/groups/{id}', 'GroupController::delete');           // Delete group

// Group Members
// Group Members
$router->get('/api/members', 'GroupController::all_members');          // Get all members
$router->get('/api/members/{id}', 'GroupController::get_member');       // Get single member
$router->post('/api/members', 'GroupController::add_member');          // Add a member
$router->put('/api/members/{id}', 'GroupController::update_member');   // Update a member
$router->delete('/api/members/{id}', 'GroupController::remove_member'); // Remove a member
// Forum routes
$router->get('/api/forum/threads', 'ForumController::threads');
$router->get('/api/forum/thread/{id}', 'ForumController::get_thread');

$router->post('/api/forum/thread', 'ForumController::create_thread');
$router->delete('/api/forum/thread/{id}', 'ForumController::delete_thread');
$router->post('/api/forum/reply', 'ForumController::create_reply');
$router->get('/api/forum/reply', 'ForumController::reply');
$router->delete('/api/forum/reply/{id}', 'ForumController::delete_reply');
