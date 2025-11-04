CREATE DATABASE peerconnectDB;
USE peerconnectDB;


CREATE TABLE users (
 id BIGINT(20) UNSIGNED PRIMARY KEY
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  skills VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Mentor', 'Mentee', 'Moderator') DEFAULT 'Mentee',
  bio TEXT,
  profile_image VARCHAR(255),
  date_joined DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Active', 'Inactive', 'Banned') DEFAULT 'Active'
);


-- 🧩 1. Mentorships Table
CREATE TABLE mentorships (
  mentorship_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  mentor_id BIGINT UNSIGNED NOT NULL,
  mentee_id BIGINT UNSIGNED NOT NULL,
  start_date DATE,
  end_date DATE,
  status ENUM('Active', 'Completed', 'Pending') DEFAULT 'Active',
  FOREIGN KEY (mentor_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  FOREIGN KEY (mentee_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

-- 🧩 2. Groups Table
CREATE TABLE groups (
  group_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(150) NOT NULL,
  description TEXT,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

-- 🧩 3. Group Members Table
CREATE TABLE group_members (
  group_member_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  role ENUM('Member', 'Moderator', 'Owner') DEFAULT 'Member',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(group_id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);


CREATE TABLE messages (
  message_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  comet_message_id VARCHAR(100) UNIQUE, -- CometChat message UID
  group_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_text TEXT,
  message_type ENUM('text', 'image', 'file', 'video', 'custom') DEFAULT 'text',
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(group_id),
  FOREIGN KEY (sender_id) REFERENCES users(user_id)
);
USE peerconnectdb
CREATE TABLE forum_threads (
  thread_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_by INT NOT NULL,
  group_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (group_id) REFERENCES groups(group_id)
);

CREATE TABLE forum_replies (
  reply_id INT AUTO_INCREMENT PRIMARY KEY,
  thread_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (thread_id) REFERENCES forum_threads(thread_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE announcements (
  announcement_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_by INT NOT NULL,
  target_group_id INT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(user_id),
  FOREIGN KEY (target_group_id) REFERENCES groups(group_id)
);

CREATE TABLE logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(255) NOT NULL,
  module VARCHAR(100) NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE system_settings (
  setting_id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value VARCHAR(255),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
