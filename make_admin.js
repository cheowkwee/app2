const CryptoJS = require("crypto-js");

require('dotenv').config();
const knex = require('./db');
const api = require('./userApi');


var makeUserGroupLink = async function() {
	var result = {};
	// result = await api.removeUserFromGroupWithEmail('cheowkwee@hotmail.com', 'ADMIN');	
	// console.log("Test result:", result);
	// console.log("----------------------------");
	result = await api.addUser2GroupWithEmail('cheowkwee@hotmail.com', 'ADMIN');	
	console.log("Test result:", result);
	console.log("----------------------------");
	var user = await api.getUserWithEmail('cheowkwee@hotmail.com');	
	console.log("Test result:", result);
	result = await api.checkUserGroup(user.id, "ADMIN");	
	console.log("Test result:", result);
};

var main = async function() {
	var argv = require('minimist')(process.argv.slice(2));

	try {
		if (argv._.length != 1)	
		{
			console.error("Missing email parameter");
			return;
		}
		let email = argv._[0];
		let result = await api.addUser2GroupWithEmail(email, 'ADMIN');	
	} 
	catch (err) {
		console.error(err);
	}
	process.exit(0);
};

main();
