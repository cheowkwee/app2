
const api = require('./userAPI');
const ErrorCodes = require('./error-codes');
const KarelyError = require('./karely-error');


let controller = {};

// GET request; 
// verify access token 
// only ADMIN can acces the list
controller.getUserList = async function(req, res, next) {
	// 20200608 verify token and admin user group
	let token = req.get("token");
	let user = await api.verifyAccessToken(token);

	let admin  = await api.isAdminUser(user.id);
	if (!admin) throw new KarelyError(ErrorCodes.INVALID_ACCESS);
	
	let data = await api.getUserList();
	res.json(data);
};

// Only admin or owner can access the data
controller.getUser = async function(req, res, next) {
	let token = req.get("token");
	let user = await api.verifyAccessToken(token);

	let admin  = await api.isAdminUser(user.id);
	if (!admin && user.id != req.params.user_id) 
		throw new KarelyError(ErrorCodes.INVALID_ACCESS);

	let data = await api.getUser(req.params.user_id);
	res.json(data);
};

/*
controller.addUser = async function(req, res, next) {
	let password = api.encodePassword(req.body.password);	

	let result = await api.addUser({
		first_name: req.body.first_name,	
		last_name: req.body.last_name,	
		email: req.body.email,	
		phone_number: req.body.phone_number,	
		password: password,	
	});

	res.json(result);
};
*/

controller.updateUserWithID = async function(req, res, next) {
	// verify token
	let token = req.get("token");
	let user = await api.verifyAccessToken(token);

	// check user group
	let admin  = await api.isAdminUser(user.id);
	if (!admin && user.id != req.params.user_id) 
		throw new KarelyError(ErrorCodes.INVALID_ACCESS);

	let data = { updated_on: new Date() };

	if (req.body.first_name != undefined) data.first_name = req.body.first_name;
	if (req.body.last_name != undefined) data.last_name = req.body.last_name;
	if (req.body.phone_number != undefined) data.phone_number = req.body.phone_number;
	if (req.body.email != undefined) data.email = req.body.email;
	if (req.body.avatar != undefined) data.avatar = req.body.avatar;
	if (req.body.biography != undefined) data.biography = req.body.biography;

	/*
	if (req.body.password != undefined)
	{
		let password = api.encodePassword(req.body.password);
		data.password = password;
	}
	*/

	let result = await api.updateUserWithID(data, req.body.id);
	res.json(result);
};

controller.deleteUserWithID = async function(req, res, next) {
	// verify token
	let token = req.get("token");
	let user = await api.verifyAccessToken(token);

	// check user group
	let admin  = await api.isAdminUser(user.id);
	if (!admin && user.id != req.params.user_id) 
		throw new KarelyError(ErrorCodes.INVALID_ACCESS);

	let result = await api.deleteUserWithID(req.body.id);
	res.json(result);
};

controller.signUpUser = async function(req, res, next) {
	let result = await api.signUpUser(req.body);
	res.json(result);
};

controller.verifyAuthorizationCode = async function(req, res, next) {
	let token = req.get("token");
	let result = await api.verifyAuthorizationCode(token, req.body.code);
	res.json(result);
};

controller.generateEmailAuthorizationCode = async function(req, res, next) {
	let result = await api.generateEmailAuthorizationCode(req.body.email);
	res.json(result);
};

controller.login = async function(req, res, next) {
	let result = await api.login(req.body.email, req.body.password);
	res.json(result);
};

controller.logout = async function(req, res, next) {
	let result = await api.logout(req.body.token);
	res.json(result);

};

controller.verifyAccessToken = async function(req, res, next) {
	let result = await api.verifyAccessToken(req.body.token);
	res.json(result.id);

};

controller.resetPassword = async function(req, res, next) {
	let result = await api.resetPassword(req.body.email);
	res.json(result);
};

controller.updateUserPassword = async function(req, res, next) {
	let token = req.get("token");
	let result = await api.updateUserPassword(token, req.body.password);
	res.json(result);
};

// POST request with token in header and body include 2 parameter (user_id and group_name)
controller.checkUserGroup = async function(req, res, next) {
	let token = req.get("token");
	let session = await api.verifyAccessToken(token);

	let groupInfo = await api.checkUserGroup(req.body.user_id, req.body.group_name);
	res.json(groupInfo);
};

controller.checkUserGroup = async function(req, res, next) {
	let result = await api.generateEmailAuthorizationCode(req.body.email);
	res.json(result);
};

controller.googleLogin = async function(req, res, next) {
	let result = await api.googleLogin(req.body.account_id, req.body.access_token);
	res.json(result);
};

controller.facebookLogin = async function(req, res, next) {
	let result = await api.facebookLogin(req.body.account_id, req.body.access_token);
	res.json(result);
};

module.exports = controller;

