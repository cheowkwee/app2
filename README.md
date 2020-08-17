# karely-backend
Karely backend API application server

# Installation guide
1. After clone run `npm install`
2. To create or update the database schema run below
```bash
$ psql -U postgres -d karely -a -f karely.sql
```

3. Change the configuration in .env (sample as below)
```bash
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

```

# Changed history log
## 28 May 2020 update
#### User basic function added
* Login, verify access token
* Sign up, verify authorization code (email)
* Reset password (link), update passowrd

**Note: Above function 70% completed, some feature still under development (password fail count check, user record CRUD on permission check and etc) ...**

## 4 Jun 2020 
* Implement express center error handling, KarelyError class and error code standard 
* Implement dotenv and remove config.js file
* Implement controller 
* Change var to const or let
* Update the express version from 4 to 5 Alpha 8
* Update on schema karely_user, karely_user_setting, karely_user_stat
* Implement user group to user account

## 8 Jun 2020 
* Implement check user group 
* Implement List users, get user info, update and delete user
* Implement user group check and access token verify on above function
* Append function to user_guide.txt

## 12 Jun 2020 
* Implement Google login, Facebook login, generate email authorization code, make some enhancement on some user funtion
* Implement cause, cause update, cause member, cause comment CRUD API
* Add SQL script to create test data

## 19 Jun 2020 
* Implement Twitter and Apple login API for backend server handling on login token verification
* Implement get avatar function on users module, mobile able to use the build-in loader to load the image 
* Enhance Facebook login API to retrieve email and avatar
* Add causes action related CRUD API (karely_causes_action, karely_cause_action_todo, karely_causes_action_todo_volunteer, karely_causes_action_fundraising, karely_causes_action_product)
* Enhance or fix bug on last week causes related API (attach user info in some causes response, permisson check on delete and update)

## 26 Jun 2020 
* Implement user stat and setting CRUD API 
* Update the sign up function to create stat and setting record with default value
* Schema update (karely_audit, karely_cause_user_setting)
* Enhance causes and cause actions various API (add filter, sort order, enrich output with user info, permission check and get cause's banner)
* Bug fix on previous week implement API (increase request message parser size to 50MB and a few typo bug)
* Append new function, parameter and feature to user_guide.txt and cause_guide.txt

## 3 Jul 2020
* Schema change (add karely_cause_category table and change karely_cause_action_todo table)
* Enhance login for password failed count and check (lock account after 5 failed)
* Enhance the update avatar and avatar loading function
* Implement and create cause notification setting for each related user (owner, follower and admin)
* Integrate audit trial or log for each cause action

## 10 Jul 2020
* Enhance cause banner loading API
* Add change user account email API
* Schema change and update (karely\_cause\_action\_todo\_address, karely\_cause\_action\_todo\_volunteer)
* Cause API action and action volunteers update, include enrich output, validation, implement new field
* Bug fix previous week implement API
* Cause guide and user guide document update 

## 17 Jul 2020
* Schema update
* Create notification server
* Bug fix on cause API (Enhance search and filter option on cause listing)

## 24 Jul 2020
* Schema update (add payment table, update user stat table)
* Implement Stripe payment API
* Enhancement for cause API base on feedback
* Enhancement and bug fix for notification server 

## 31 Jul 2020
* Schema update (give back table and stripe payment account state table)
* Remove the get user state API user owner check
* Add stripe account create API for payment module
* Add give back API 
* Enhance user cause stat API

## 7 Aug 2020
* Enhance the Stripe connect implementation
* Code change base on review comment
* Implement stat API module
* Enhance give back API 
* Bug fix and enhancement base on integration feedback

## 14 Aug 2020
* Add reason code for Karely error object
* Change schema timestamp field with timestamp include timezone
* Add cause report API
* Enhance cause listing filter feature, stats API and list volunteer function


