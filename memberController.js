const userapi = require('./userAPI');
const causeapi = require('./causeAPI');
const api = require('./memberAPI');

let controller = {};

controller.getMemberList = async function(req, res, next) {
	let data = await api.getMemberList();
	res.json(data);
};

controller.getMember = async function(req, res, next) {
	let data = await api.getMember(req.body.id);
	res.json(data);
};

controller.searchMember = async function(req, res, next) {
	let data = await api.searchMember({
		cause_id : req.body.cause_id,
		user_id : req.body.user_id
	});
	res.json(data);
};

controller.getCauseMember = async function(req, res, next) {
	let data = await api.getCauseMember(req.body.cause_id);
	res.json(data);
};

controller.addMember = async function(req, res, next) {
	let tokenvalue = await userapi.verifyAccessToken(req.body.token);
	let causevalue = await causeapi.getcause(req.body.cause_id);

	let result = await api.addMember({
		cause_id : causevalue['id'],
		user_id : tokenvalue['id'],
		admin_flag : 0,
		status : 0
	});

	res.json(result);
};
controller.approveMember = async function(req, res, next) {
	let data = { updated_on: new Date() };
	let tokenvalue = await userapi.verifyAccessToken(req.body.token);
	let causevalue = await api.getMember(req.body.id);
	let ownervalue = await causeapi.getCauseOwner(causevalue['cause_id'], tokenvalue['id']);

	data.status = 1;
	
	let result = await api.approveMember(data, req.body.id);
	res.json(result);
};

controller.updateMemberWithID = async function(req, res, next) {
	let data = { updated_on: new Date() };

	if (req.body.cause_id != undefined) data.cause_id = req.body.cause_id;
	if (req.body.user_id != undefined) data.user_id = req.body.user_id;
	if (req.body.admin_flag != undefined) data.admin_flag = req.body.admin_flag;
	if (req.body.status != undefined) data.status = req.body.status;
	

	let result = await api.updateMemberWithID(data, req.body.id);
	res.json(result);
};

controller.deleteMemberWithID = async function(req, res, next) {
	let result = await api.deleteMemberWithID(req.body.id);
	res.json(result);
};


module.exports = controller;

