1) After clone run npm install

2) To create or update the database schema run below

psql -U postgres -d karely -a -f karely.sql

3) Change the configuration in .env (sample as below)

$ cat .env
DB_URL=postgres://user:password@localhost:5432/karely
DB_DEBUG=false
CORS_FLAG=true
PASSWORD_KEY=xxxxx

MAIL_SERVER_HOST='smtp.googlemail.com'
MAIL_SERVER_PORT=465
MAIL_SERVER_SECURE=true
MAIL_SERVER_USER='xxxx@gmail.com'
MAIL_SERVER_PASSWORD='xxxxx'

### end of file ###


28 May 2020 update
User basic function added
1) Login, verify access token
2) Sign up, verify authorization code (email)
3) Reset password (link), update passowrd

Note: Above function 70% completed, some feature still under development (password fail count check, user record CRUD on permission check and etc) ...

4 Jun 2020 update
Implement express center error handling, KarelyError class and error code standard 
Implement dotenv and remove config.js file
Implement controller 
Change var to const or let
Update the express version from 4 to 5 Alpha 8
Update on schema karely_user, karely_user_setting, karely_user_stat
Implement user group to user account

8 Jun 2020 update
Implement check user group 
Implement List users, get user info, update and delete user
Implement user group check and access token verify on above function
Append function to user_guide.txt


