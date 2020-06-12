"use strict";

const axios = require('axios');
const CryptoJS = require("crypto-js");
const moment = require('moment');
// const uuid = require('uuid');
const { v4: uuidv4 } = require('uuid');

const knex = require('./db');
const mailer = require('./mailer');
const ErrorCodes = require('./error-codes');
const KarelyError = require('./karely-error');


console.log('Load user API ...');

const karelyAccountType = 0;
const googleAccountType = 1;
const facebookAccountType = 2;

const normalGroupName = "KARELY";
const adminGroupName = "ADMIN";

const groupTableName = "karely_user_group";
const userGroupLinkTableName = "karely_user_group_link";
const userTableName = "karely_user";
const sessionTableName = "karely_user_session";

let api = {};

let userFieldList = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'status', 'account_type', 'account_id', 'created_on', 'updated_on' ];

let passwordKey = process.env.PASSWORD_KEY;
if (passwordKey == undefined) console.error("Plase provide PASSWORD_KEY");

let sessionDurationValue = process.env.SESSION_DURATION_VALUE || 1;
let sessionDurationType = process.env.SESSION_DURATION_TYPE || 'months';

let shortSessionDurationValue = process.env.SHORT_SESSION_DURATION_VALUE || 1;
let shortSessionDurationType = process.env.SHORT_SESSION_DURATION_TYPE || 'days';

let resetPasswordURL = process.env.RESET_PASSWORD_URL || 'http://localhost:8000/app2/testResetPasswordView.html';

// verify google, FB token URL
let googleTokenInfoURL = process.env.GOOGLE_TOKEN_INFO_URL || 'https://oauth2.googleapis.com/tokeninfo';
let facebookMeURL = process.env.FACEBOOK_ME_URL || 'https://graph.facebook.com/me';

api.getUserList = async function(flag) {

	if (flag == undefined) flag = false;
	let sql = knex.select(userFieldList);
	sql = sql.from(userTableName);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data);
	if (data.length == 0 && flag == true) return data;
	else if (data.length == 0 && flag == false) 
		throw new KarelyError(ErrorCodes.USER_NOT_FOUND);
	else return data;
};

api.getUser = async function(id, flag) {

	if (flag == undefined) flag = false;
	if (id == undefined) 
		throw new KarelyError(ErrorCodes.INVALID_PARAMETER);
	let sql = knex.select(userFieldList);
	sql = sql.from(userTableName);
	sql = sql.where("id", id);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data);

	if (data.length == 0 && flag == true) return undefined;
	else if (data.length == 0 && flag == false) 
		throw new KarelyError(ErrorCodes.USER_NOT_FOUND);

	return data[0];
};

api.getUserWithEmail = async function(email) {

	if (email == undefined) 
		throw new KarelyError(ErrorCodes.INVALID_PARAMETER);
	let sql = knex.select('*');
	sql = sql.from(userTableName);
	sql = sql.where("email", email);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data[0]);

	if (data.length == 0) 
		throw new KarelyError(ErrorCodes.USER_NOT_FOUND);
	else return data[0];
};

api.getUserWithAccountID = async function(accountType, accountId, flag) {

	if (flag == undefined) flag = false;

	let sql = knex.select('*');
	sql = sql.from(userTableName);
	sql = sql.where("account_type", accountType);
	sql = sql.andWhere("account_id", accountId);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data[0]);

	if (data.length == 0 && flag == true) return undefined;
	else if (data.length == 0 && flag == false) 
		throw new KarelyError(ErrorCodes.USER_NOT_FOUND);

	return data[0];
};

api.addUser = async function(data)
{
	let result = await knex(userTableName).insert(data).returning('*'); 
	if (result.length == 0) 
		throw new KarelyError(ErrorCodes.INSERT_FAIL);
	else return result[0];
};

api.updateUserWithID = async function(data, id)
{
	if (id == undefined) 
		throw new KarelyError(ErrorCodes.INVALID_PARAMETER);
	let result = await knex(userTableName).update(data).where({ 'id': id }).returning('id'); 
	if (result.length == 0) 
		throw new KarelyError(ErrorCodes.UPDATE_FAIL);
	else return result[0];
};

api.deleteUserWithID = async function(id)
{
	if (id == undefined) 
		throw new KarelyError(ErrorCodes.INVALID_PARAMETER);
	let result = await knex(userTableName).where({ 'id': id }).delete().returning('id'); 
	if (result.length == 0) 
		throw new KarelyError(ErrorCodes.DELETE_FAIL);
	return result[0];
};

api.encodePassword = function(password) {
	let hash = CryptoJS.HmacSHA256(password, passwordKey);
	let s = hash.toString(CryptoJS.enc.Hex);
	console.log("Encode password: [" + s + "]");
	return s;
};

// User group related function
api.getGroupWithName = async function(groupName, flag) {
	if (groupName == undefined) 
		throw new KarelyError(ErrorCodes.INVALID_PARAMETER);
	if (flag == undefined) flag = false;

	let sql = knex.select('*');
	sql = sql.from(groupTableName);
	sql = sql.where("group_name", groupName);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data);

	if (data.length == 0 && flag == true) return undefined;
	else if (data.length == 0 && flag == false) 
		throw new KarelyError(ErrorCodes.RECORD_NOT_FOUND);

	return data[0];

};

api.getUserGroupLink = async function(userId, groupId, flag) {
	if (groupId == undefined || userId == undefined) 
		throw new KarelyError(ErrorCodes.INVALID_PARAMETER);
	if (flag == undefined) flag = false;

	let sql = knex.select('*');
	sql = sql.from(userGroupLinkTableName);
	sql = sql.where("group_id", groupId);
	sql = sql.andWhere("user_id", userId);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data);

	if (data.length == 0 && flag == true) return undefined;
	else if (data.length == 0 && flag == false) 
		throw new KarelyError(ErrorCodes.RECORD_NOT_FOUND);

	return data[0];

};

api.getUserGroupLinkList = async function(userId, flag) {
	if (flag == undefined) flag = false;

	let sql = knex.select(userGroupLinkTableName + '.*', groupTableName + '.group_name');
	sql = sql.from(userGroupLinkTableName);
	sql = sql.join(groupTableName, userGroupLinkTableName + '.group_id', '=', groupTableName + '.id')
	sql = sql.where("user_id", userId);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data);

	if (data.length == 0 && flag == true) return data;
	else if (data.length == 0 && flag == false) 
		throw new KarelyError(ErrorCodes.RECORD_NOT_FOUND);
	else return data;
	
};

// return if found user in group return user group info else return error record not found
api.checkUserGroup = async function(userId, groupName, flag) {
	if (flag == undefined) flag = false;

	let sql = knex.select(userGroupLinkTableName + '.*', groupTableName + '.group_name');
	sql = sql.from(userGroupLinkTableName);
	sql = sql.join(groupTableName, userGroupLinkTableName + '.group_id', '=', groupTableName + '.id')
	sql = sql.where("user_id", userId);
	sql = sql.andWhere(groupTableName + ".group_name", groupName);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data);

	if (data.length == 0 && flag == true) return undefined;
	else if (data.length == 0 && flag == false) throw new KarelyError(ErrorCodes.RECORD_NOT_FOUND);
	else return data[0];
};

api.isAdminUser = async function(userId) {

	let groupInfo = await api.checkUserGroup(userId, adminGroupName, true);
	if (groupInfo != undefined) return true;
	else return false;
};

api.addUser2GroupWithEmail = async function(email, groupName) {
	let user = await api.getUserWithEmail(email);
	return await api.addUser2Group(user.id, groupName);
};

api.addUser2Group = async function(userId, groupName) {
	let group = await api.getGroupWithName(groupName);
	let userGroupLink = await api.getUserGroupLink(userId, group.id, true);
	if (userGroupLink == undefined)
	{
		// add new record
		let data = {
			group_id: group.id,
			user_id: userId
		};
		let result = await knex(userGroupLinkTableName).insert(data).returning('*'); 
		if (result.length == 0) throw new KarelyError(ErrorCodes.INSERT_FAIL);
		else return result[0];
	}
	else throw new KarelyError(ErrorCodes.RECORD_ALREADY_EXISTS);
};

api.removeUserFromGroupWithEmail = async function(email, groupName) {
	let user = await api.getUserWithEmail(email);
	return await api.removeUserFromGroup(user.id, groupName);
};

api.removeUserFromGroup = async function(userId, groupName) {
	let group = await api.getGroupWithName(groupName);
	let result = await knex(userGroupLinkTableName).where({ 'user_id': userId }).andWhere({ 'group_id': group.id }).delete().returning('id'); 
	if (result.length == 0) 
		throw new KarelyError(ErrorCodes.DELETE_FAIL);
	return result[0];
};


// User session related 
api.deleteSession = async function(token)
{
	let result = await knex(sessionTableName).where({ 'token': token }).delete().returning('token'); 
	if (result.length == 0) 
		throw new KarelyError(ErrorCodes.DELETE_FAIL);
	return result[0];
};

api.getSession = async function(token, type) {

	if (type == undefined) type = 0;
	let dt = new Date();
	if (token == undefined) 
		throw new KarelyError(ErrorCodes.INVALID_TOKEN);
	let sql = knex.select('*');
	sql = sql.from(sessionTableName);
	sql = sql.where("token", token);
	sql = sql.andWhere("session_type", type);
	sql = sql.andWhere("expired_on", ">", dt);
	// console.log("SQL:", sql.toString());

	let data = await sql;
	// console.log("Data:", data[0]);

	if (data.length == 0) throw new KarelyError(ErrorCodes.INVALID_TOKEN);
	else if (data.length == 1) return data[0];
	else return data;
};

api.addNormalUserSession = async function(id)
{
	let expired = moment().add(sessionDurationValue, sessionDurationType).toDate();
	let data = {
		token: uuidv4(),
		user_id: id,
		session_type: 0,
		expired_on: expired,
		remark: "Normal user session",
	};
	let result = await knex(sessionTableName).insert(data).returning('*'); 
	console.log("Result:", result);

	if (result.length == 0) throw new KarelyError(ErrorCodes.INSERT_FAIL);
	return result[0];
};

api.addAuthorizationCodeSession = async function(id)
{
	let expired = moment().add(shortSessionDurationValue, shortSessionDurationType).toDate();
	let data = {
		token: uuidv4(),
		user_id: id,
		session_type: 9,
		expired_on: expired,
		authorization_code: api.randomNumber(1000, 9999),
		remark: "Email authorization code",
	};
	let result = await knex(sessionTableName).insert(data).returning('*'); 
	console.log("Result:", result);

	if (result.length == 0) throw new KarelyError(ErrorCodes.INSERT_FAIL);
	return result[0];
};

api.addResetPasswordSession = async function(id)
{
	let expired = moment().add(shortSessionDurationValue, shortSessionDurationType).toDate();
	let data = {
		token: uuidv4(),
		user_id: id,
		session_type: 8,
		expired_on: expired,
		remark: "Reset password",
	};
	let result = await knex(sessionTableName).insert(data).returning('*'); 
	console.log("Result:", result);

	if (result.length == 0) throw new KarelyError(ErrorCodes.INSERT_FAIL);
	return result[0];
};

// login
// check record status
// check password 
// create session
// get user groups 
// ??? lock account when 3 times failed
// ??? add account status check for email verification (status field)
// ??? add last login timestamp
// ??? implement transaction 

api.login = async function(email, password) {
	let user = await api.getUserWithEmail(email);
	console.log(user);

	if (user.status == 0) 
		throw new KarelyError(ErrorCodes.REQUEST_VERIFICATION);
	else if (user.status != 1) 
		throw new KarelyError(ErrorCodes.INVALID_STATUS);

	let hash = api.encodePassword(password);
	if (user.password != hash) 
		throw new KarelyError(ErrorCodes.INVALID_PASSWORD);
	console.log("Password ok");
	// add user sesion record
	let session = await api.addNormalUserSession(user.id);

	// 20200608 add user groups 
	let userGroups = await api.getUserGroupLinkList(user.id, true);

	// add session/token to user record
	delete user.password;
	delete session.authorization_code;
	user.session = session;
	user.userGroups = userGroups;
	return user;
};

// Verify access token
// 	the web API verison only return user id
api.verifyAccessToken = async function(token) {
	
	let session = await api.getSession(token);
	let user = await api.getUser(session.user_id);

	user.session = session;
	return user;
};

api.randomNumber = function(min, max) {
	// include min value but not include max value
	return Math.floor(Math.random() * (max - min)) + min;
};

// 20200609
api.sendEmail4AuthorizationCode = async function(email, code) {

	let result = await mailer.sendMail({
		from: 'Karely <noreply@karely.com>',
		to: email,
		subject: 'Email authorization code for Karely user',
		text: 'You email authorization code ' + code + '\nGenerated on ' + new Date(),
	}); 
	console.log("Email ID:" + result.messageId);

	return result;
};

// Sign up normal user
// 	add user
//	link user to group
//	generate authentication code (4 digit code)
//	send email (4 digit code)
api.signUpUser = async function(data) {
	let hash = api.encodePassword(data.password);
	data.password = hash;
	delete data.status;

	let user = await api.addUser(data);
	let groupLink = await api.addUser2Group(user.id, normalGroupName);
	
	console.log(user);

	let session = await api.addAuthorizationCodeSession(user.id);
	let result = await api.sendEmail4AuthorizationCode(user.email, session.authorization_code);

	delete user.password;
	delete session.authorization_code;
	user.session = session;
	return user;
};

// 20200609
api.generateEmailAuthorizationCode = async function(email) {
	let user = await api.getUserWithEmail(email);

	let session = await api.addAuthorizationCodeSession(user.id);
	let result = await api.sendEmail4AuthorizationCode(user.email, session.authorization_code);

	// prepare output 
	delete user.password;
	delete session.authorization_code;
	user.session = session;
	return user;
};

// Verify authorization code
// 20200611 add login session after verify code
api.verifyAuthorizationCode = async function(token, code) {
	let session = await api.getSession(token, 9);
	if (session.authorization_code != code)	
		throw new KarelyError(ErrorCodes.INVALID_CODE);
	let result = await api.updateUserWithID({ 
		status: 1, 
		email_verification_flag: true, 
		email_verification_on: new Date() 
		}, session.user_id);

	// create new session
	let user = await api.getUser(session.user_id);
	session = await api.addNormalUserSession(user.id);
	let userGroups = await api.getUserGroupLinkList(user.id, true);
	// prepare output 
	delete user.password;
	delete session.authorization_code;
	user.session = session;
	user.userGroups = userGroups;
	return user;
};

// Reset password
// 	add token
// 	send link to user
api.resetPassword = async function(email) {
	let user = await api.getUserWithEmail(email);
	let session = await api.addResetPasswordSession(user.id);

	// let url = "http://localhost:8000/app2/resetPasswordView.html?token=" + session.token;
	let url = resetPasswordURL + "?token=" + session.token;
	let result = await mailer.sendMail({
		from: 'Karely <noreply@karely.com>',
		to: user.email,
		subject: 'Karely user reset password request',
		text: 'Reset password link ' + url + '\nGenerated on ' + new Date(),
	}); 
	console.log("Email ID:" + result.messageId);

	delete user.password;
	delete session.authorization_code;
	user.session = session;
	return user;
};

// Update user password
// 	verify password token
// 	update only password
api.updateUserPassword = async function(token, password) {
	let session = await api.getSession(token, 8);
	let hash = api.encodePassword(password);
	let result = await api.updateUserWithID({ status: 1, password: hash }, session.user_id);
	let token1 = await api.deleteSession(token);
	console.log(token1);
	return result;
};

// Logout
api.logout = async function(token) {
	let session = await api.getSession(token);
	let result = await api.deleteSession(token);
	console.log(result);
	delete session.authorization_code;
	return session.user_id;
};

// Google login
// 	verify token
// 	get user with account id
//	if no exist create user 
// 	else update user
// 	create normal session
api.googleLogin = async function(accountId, accessToken) {

	let url = googleTokenInfoURL + '?id_token=' + accessToken;
	console.log("URL: " + url);

	let res = await axios.get(url);
	let data = res.data;
	console.log("Return data", data);

	if (data.sub != accountId) throw new KarelyError(ErrorCodes.INVALID_TOKEN);

	let user = await api.getUserWithAccountID(googleAccountType, accountId, true);

	if (user == undefined)
	{
		user = {};
		user.first_name = data.given_name;
		user.last_name = data.family_name;
		user.email = data.email;
		user.avatar = data.picture;
		user.account_type = googleAccountType;
		user.account_id = accountId;
		
		user = await api.addUser(user);
		user.new_flag = true;
		let groupLink = await api.addUser2Group(user.id, normalGroupName);
	}
	else
	{
		user.first_name = data.given_name;
		user.last_name = data.family_name;
		user.email = data.email;
		user.avatar = data.picture;
		let result = await api.updateUserWithID(user, user.id);

		user.new_flag = false;
	}

	let session = await api.addNormalUserSession(user.id);
	let userGroups = await api.getUserGroupLinkList(user.id, true);

	// prepare output 
	delete user.password;
	delete session.authorization_code;
	user.session = session;
	user.userGroups = userGroups;
	return user;	
};

api.facebookLogin = async function(accountId, accessToken) {

	let url = facebookMeURL + '?access_token=' + accessToken;
	console.log("URL: " + url);

	let res = await axios.get(url);
	let data = res.data;
	console.log("Return data", data);

	if (data.id != accountId) throw new KarelyError(ErrorCodes.INVALID_TOKEN);

	let user = await api.getUserWithAccountID(facebookAccountType, accountId, true);

	if (user == undefined)
	{
		user = {};
		user.first_name = "";
		user.last_name = data.name;
		user.account_type = facebookAccountType;
		user.account_id = accountId;
		
		user = await api.addUser(user);
		user.new_flag = true;
		let groupLink = await api.addUser2Group(user.id, normalGroupName);
	}
	else
	{
		user.first_name = "";
		user.last_name = data.name;
		let result = await api.updateUserWithID(user, user.id);

		user.new_flag = false;
	}

	let session = await api.addNormalUserSession(user.id);
	let userGroups = await api.getUserGroupLinkList(user.id, true);

	// prepare output 
	delete user.password;
	delete session.authorization_code;
	user.session = session;
	user.userGroups = userGroups;
	return user;	
};

// export API here
module.exports = api;

