
DROP TABLE IF EXISTS karely_product;
DROP TABLE IF EXISTS karely_cause_action_todo_volunteer;
DROP TABLE IF EXISTS karely_cause_action_product;
DROP TABLE IF EXISTS karely_cause_action_fundraising;
DROP TABLE IF EXISTS karely_cause_action_todo;
DROP TABLE IF EXISTS karely_cause_action;
DROP TABLE IF EXISTS karely_cause_member;
DROP TABLE IF EXISTS karely_cause_comment;
DROP TABLE IF EXISTS karely_cause_update;
DROP TABLE IF EXISTS karely_cause;

DROP TABLE IF EXISTS karely_user_stat;
DROP TABLE IF EXISTS karely_user_setting;
DROP TABLE IF EXISTS karely_user_session;
DROP TABLE IF EXISTS karely_user_group_link;
DROP TABLE IF EXISTS karely_user;
DROP TABLE IF EXISTS karely_user_group;

CREATE TABLE karely_user_group(
	id SERIAL PRIMARY KEY,
	group_name VARCHAR(50) UNIQUE,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO karely_user_group (group_name) VALUES ('KARELY');
INSERT INTO karely_user_group (group_name) VALUES ('ADMIN');

SELECT * from karely_user_group;

CREATE TABLE karely_user(
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	email VARCHAR(255),
	phone_number VARCHAR(255),
	password VARCHAR(255),
	avatar TEXT,
	biography TEXT,
	account_type INT NOT NULL DEFAULT 0,
	account_id VARCHAR(255),
	status INT NOT NULL DEFAULT 0,		
	login_failed_count INT NOT NULL DEFAULT 0,		
	last_login_on TIMESTAMP,
	email_verification_flag BOOLEAN NOT NULL DEFAULT FALSE,
	email_verification_on TIMESTAMP,
	email_show_flag BOOLEAN NOT NULL DEFAULT FALSE,
	phone_verification_flag BOOLEAN NOT NULL DEFAULT FALSE,
	phone_verification_on TIMESTAMP,
	phone_show_flag BOOLEAN NOT NULL DEFAULT FALSE,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX karely_user_idx_1 ON karely_user(account_type, email);
CREATE UNIQUE INDEX karely_user_idx_2 ON karely_user(account_type, account_id);

/*
	Account type 0 for local account, 1 for Google, 2 for Facebook and 3 for Twitter
	Status 0 for inactive, 1 for active (verify email) 
*/

CREATE TABLE karely_user_group_link(
	id SERIAL PRIMARY KEY,
	group_id INT4 REFERENCES karely_user_group(id) ON DELETE CASCADE,
	user_id INT4 REFERENCES karely_user(id) ON DELETE CASCADE,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE karely_user_session(
	token VARCHAR(255) PRIMARY KEY,
	user_id INT4 REFERENCES karely_user(id) ON DELETE CASCADE,
	remark VARCHAR(255),
	authorization_code VARCHAR(50),
	session_type INT NOT NULL DEFAULT 0,
	expired_on TIMESTAMP, 
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE karely_user_setting (
	id SERIAL PRIMARY KEY,
	user_id INT4 REFERENCES karely_user(id) ON DELETE CASCADE,
	message_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_pause_all_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_general_info_update_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_new_status_added_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_status_update_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_reply_to_my_comment_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_new_action_added_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_new_member_join_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_other_member_taking_action_flag BOOLEAN NOT NULL DEFAULT FALSE,
	admin_pause_all_flag BOOLEAN NOT NULL DEFAULT FALSE,
	admin_new_todo_sign_up_flag BOOLEAN NOT NULL DEFAULT FALSE,
	admin_new_event_sign_up_flag BOOLEAN NOT NULL DEFAULT FALSE,
	admin_receive_fund_flag BOOLEAN NOT NULL DEFAULT FALSE,
	admin_receive_product_flag BOOLEAN NOT NULL DEFAULT FALSE,
	admin_new_comment_flag BOOLEAN NOT NULL DEFAULT FALSE,
	product_update_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_weekly_digest_email_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_product_update_email_flag BOOLEAN NOT NULL DEFAULT FALSE,
	cause_product_newletter_email_flag BOOLEAN NOT NULL DEFAULT FALSE,
	feedback_email_flag BOOLEAN NOT NULL DEFAULT FALSE,
	sms_message_flag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE karely_user_stat (
	id SERIAL PRIMARY KEY,
	user_id INT4 REFERENCES karely_user(id) ON DELETE CASCADE,
	followed_cause_count INT DEFAULT 0,
	owned_cause_count INT DEFAULT 0,
	contributed_hours INT DEFAULT 0,
	product_contributed_count INT DEFAULT 0,
	badges_collected_count INT DEFAULT 0,
	donated_amount NUMERIC(12, 2) DEFAULT 0
);




CREATE TABLE karely_cause(
	id SERIAL PRIMARY KEY,
	user_id INT4 REFERENCES karely_user(id) ON DELETE CASCADE,
	title VARCHAR(50) NOT NULL,
	story TEXT NOT NULL,
	visibility BOOLEAN NOT NULL DEFAULT FALSE,
	cause_type INT NOT NULL DEFAULT 0,
	cause_related_1 VARCHAR(50),
	cause_related_2 VARCHAR(50),
	cause_related_3 VARCHAR(50),
	photo TEXT,
	beneficiary_flag BOOLEAN NOT NULL DEFAULT FALSE,
	beneficiary_first_name VARCHAR(50),
	beneficiary_last_name VARCHAR(50),
	beneficiary_email VARCHAR(255),
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/*
	Cause related to ?
	Beneficiary split field ?
	level on update ?
	status field ?
	admin user ?
*/

CREATE TABLE karely_cause_update (
	id SERIAL PRIMARY KEY,
	cause_id INT REFERENCES karely_cause(id) ON DELETE CASCADE,
	update_by INT REFERENCES karely_user(id) ON DELETE CASCADE,
	message TEXT,
	status INT NOT NULL DEFAULT 0,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE karely_cause_comment (
	id SERIAL PRIMARY KEY,
	cause_id INT REFERENCES karely_cause(id) ON DELETE CASCADE,
	comment_by INT REFERENCES karely_user(id) ON DELETE CASCADE,
	message TEXT,
	comment_target INT,
	comment_level INT,
	status INT NOT NULL DEFAULT 0,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE karely_cause_member (
	id SERIAL PRIMARY KEY,
	cause_id INT REFERENCES karely_cause(id) ON DELETE CASCADE,
	user_id INT REFERENCES karely_user(id) ON DELETE CASCADE,
	admin_flag BOOLEAN NOT NULL DEFAULT FALSE,
	status BOOLEAN NOT NULL DEFAULT FALSE,		-- 0 for ok, 1 for ban
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

/*
CREATE TABLE karely_cause_admin (
	id SERIAL PRIMARY KEY,
	cause_id INT REFERENCES karely_cause(id) ON DELETE CASCADE,
	user_id INT REFERENCES karely_user(id) ON DELETE CASCADE,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
*/


CREATE TABLE karely_cause_action (
	id SERIAL PRIMARY KEY,
	cause_id INT REFERENCES karely_cause(id) ON DELETE CASCADE,
	action_type INT NOT NULL DEFAULT 0,		-- 0 for todo, 1 for fundraising, 2 for product 
	action_id INT,
	priority INT, -- 1 for urgent, 
	status INT, -- 0 active, 1 completed, 2 overdue
	title VARCHAR(50) NOT NULL,
	description TEXT,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE karely_cause_action_todo (
	id SERIAL PRIMARY KEY,
	action_id INT REFERENCES karely_cause_action(id) ON DELETE CASCADE,
	cause_id INT REFERENCES karely_cause(id) ON DELETE CASCADE,
	user_id INT REFERENCES karely_user(id) ON DELETE CASCADE,
	fix_volunteers BOOLEAN NOT NULL DEFAULT FALSE,
	volunteers INT,
	recurrence INT,		-- 0 - daily, 1 - weekly, 2 - monthly and 3 - ??? 	
	start_location TEXT,	-- need to be confirm
	end_location TEXT, 
	start_time TIMESTAMP NOT NULL,
	end_time TIMESTAMP NOT NULL
);

CREATE TABLE karely_cause_action_todo_volunteer (
	id SERIAL PRIMARY KEY,
	action_id INT REFERENCES karely_cause_action(id) ON DELETE CASCADE,
	cause_id INT REFERENCES karely_cause(id) ON DELETE CASCADE,
	user_id INT REFERENCES karely_user(id) ON DELETE CASCADE,
	status INT, -- 0 active, 1 requested, 2 quit, 3 kicked 
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE karely_cause_action_fundraising (
	action_id INT REFERENCES karely_cause_action(id) ON DELETE CASCADE,
	cause_id INT REFERENCES karely_cause(id) ON DELETE CASCADE,
	user_id INT REFERENCES karely_user(id) ON DELETE CASCADE,
	goal_amount DECIMAL(13, 4) NOT NULL,
	currency_type INT,
	deadline  TIMESTAMP,
	routing_number INT,
	account_number INT
);

CREATE TABLE karely_cause_action_product (
	action_id INT REFERENCES karely_cause_action(id) ON DELETE CASCADE,
	cause_id INT REFERENCES karely_cause(id) ON DELETE CASCADE,
	user_id INT REFERENCES karely_user(id) ON DELETE CASCADE,
	product_id INT,
	goal_quantity INT,
	routing_number INT,
	account_number INT
);

CREATE TABLE karely_product (
	product_id INT,
	user_id INT REFERENCES karely_user(id) ON DELETE CASCADE,
	product_type INT,
	brand TEXT,
	product_name TEXT,
	product_description TEXT,
	rating DECIMAL(13, 4),
	quantity INT,
	price DECIMAL(13, 4) NOT NULL,
	currency_type INT,
	photo TEXT,
	status INT,
	shipping_from TEXT,
	shipping_fee DECIMAL(13, 4),
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);



