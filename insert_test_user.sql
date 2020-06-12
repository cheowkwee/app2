
INSERT INTO karely_user (first_name, last_name, email) VALUES ('Calvin', 'Goh', 'calvin.goh@tortugamobile.com');
INSERT INTO karely_user (first_name, last_name, email) VALUES ('Alvin', 'Goh', 'alvin.goh@tortugamobile.com');
INSERT INTO karely_user (first_name, last_name, email, account_type, account_id) VALUES ('Alvin', 'Goh', null, 1, '1234');
INSERT INTO karely_user (first_name, last_name, email, account_type, account_id) VALUES ('Alvin', 'Goh', null, 1, '1235');
INSERT INTO karely_user (first_name, last_name, email, account_type, account_id) VALUES ('Alvin', 'Goh', 'calvin.goh@tortugamobile.com', 1, '1236');

SELECT * from karely_user_group;
SELECT id, first_name, last_name, email, account_type, account_id from karely_user;

