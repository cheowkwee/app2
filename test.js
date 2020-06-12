var CryptoJS = require("crypto-js");

require('dotenv').config();
var knex = require('./db');
var api = require('./userApi');

var fun0 = async function()
{
	try {

	} catch (err) {
		console.log("Exception", err);
	}
	process.exit(0);
};

var fun1 = async function()
{
	var data = await knex.select('*').from('karely_user');
	console.log(data);

	/*
	for (var n in data)
	{
		var rec = data[n];
		console.log("Record " + n + ":", rec);
	}
	*/

	var data2 = await knex.select('*').from('karely_user_session');
	console.log(data2);
};

var testLogin = async function()
{
	var result = await api.login("cheowkwee@hotmail.com", "May@2020");	
	console.log("Test result:", result);
};

var testLogout = async function()
{
	var result = await api.logout("b8429fd3-8eb7-408a-9d16-1f34c376bf3a");	
	console.log("Test result:", result);
};

var testVerifyToken = async function()
{
	var result = await api.verifyAccessToken("40685b21-020f-4ab1-931e-7b2d3e568276");	
	console.log("Test result:", result);
};

var testSignUp = async function()
{
	var user = {
		first_name: "CK",
		last_name: "Goh",
		email: "cheowkwee@hotmail.com",
		phone_number: "+60126196907",
		password: "May@2020"
	};
	var result = await api.signUpUser(user);	
	console.log("Test result:", result);
};

var testVerifyAuthorizationCode = async function()
{
	var result = await api.verifyAuthorizationCode("6c96e42e-8ae9-425a-8e7e-39ed079e4abb", "7678");	
	console.log("Test result:", result);
};

var testResetPassword = async function()
{
	var result = await api.resetPassword("cheowkwee@hotmail.com");	
	console.log("Test result:", result);
};

var testUpdateUserPassword = async function()
{
	var result = await api.updateUserPassword("fca63df8-3c03-4331-9c89-418c2ef0ef8d", "Jun@2020");	
	console.log("Test result:", result);
};

var testRemoveGroupLink = async function()
{
	result = await api.removeUserFromGroupWithEmail('cheowkwee@hotmail.com', 'ADMIN');	
	console.log("Test result:", result);
};

var testUserGroupLink = async function()
{
	var result = {};
	// result = await api.removeUserFromGroupWithEmail('cheowkwee@hotmail.com', 'ADMIN');	
	// console.log("Test result:", result);
	// result = await api.removeUserFromGroupWithEmail('cheowkwee@hotmail.com', 'KARELY');	
	// console.log("Test result:", result);
	// console.log("----------------------------");
	// result = await api.addUser2GroupWithEmail('cheowkwee@hotmail.com', 'KARELY');	
	// console.log("Test result:", result);
	// result = await api.addUser2GroupWithEmail('cheowkwee@hotmail.com', 'ADMIN');	
	// console.log("Test result:", result);
	// console.log("----------------------------");
	result = await api.getUserGroupLinkList(4);	
	console.log("Test result:", result);
	console.log("----------------------------");
	var user = await api.getUserWithEmail('cheowkwee@hotmail.com');	
	console.log("Test result:", result);
	result = await api.checkUserGroup(user.id, "KARELY");	
	console.log("Test result:", result);
};
var main = async function() {
	try {
		// await fun1();
		// console.log("----------------------------");
		// await testUpdateUserPassword();
		// console.log("----------------------------");
		// await fun1();
		// await testSignUp();
		// await testVerifyAuthorizationCode();
		// await testLogin();
		// await testVerifyToken();
		// await testLogout();
		// await testResetPassword();
		await testRemoveGroupLink();
		await testUserGroupLink();

	} catch (err) {
		console.log("Exception", err);
		console.log("message: " + err.message);
		console.log("code: " + err.code);
		console.log("info: " + err.info);
	}
	process.exit(0);
};

main();

