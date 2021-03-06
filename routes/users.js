var express = require('express');
var knex = require('../db');
var api = require('../userAPI');
var CryptoJS = require("crypto-js");

var router = express.Router();
// var key = "Super123";

router.get('/', async function(req, res, next) {

	try {
		var data = await api.getUserList();
  		res.json(data);
	} catch (err) {
		console.log("Exception:", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.get('/:id', async function(req, res, next) {

	try {
		var data = await api.getUser(req.params.id);
		res.json(data);

	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.post('/add', async function(req, res, next) {

	try {
		var password = api.encodePassword(req.body.password);	

		var result = await api.addUser({
			first_name: req.body.first_name,	
			last_name: req.body.last_name,	
			email: req.body.email,	
			phone_number: req.body.phone_number,	
			password: password,	
		});

		res.json(result);

	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.post('/update', async function(req, res, next) {
	try {
		var data = { updated_on: new Date() };
		if (req.body.first_name != undefined) data.first_name = req.body.first_name;
		if (req.body.last_name != undefined) data.last_name = req.body.last_name;
		if (req.body.phone_number != undefined) data.phone_number = req.body.phone_number;
		if (req.body.email != undefined) data.email = req.body.email;
		if (req.body.password != undefined) 
		{
			var password = api.encodePassword(req.body.password);	
			data.password = password;
		}

		var result = await api.updateUserWithID(data, req.body.id);
		res.json(result);
	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.post('/delete', async function(req, res, next) {
	try {
		var result = await api.deleteUserWithID(req.body.id);
		res.json(result);
	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.post('/signUp', async function(req, res, next) {
	try {
		var result = await api.signUpUser(req.body);
		res.json(result);
			
	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.post('/verifyAuthorizationCode', async function(req, res, next) {
	try {
		var token = req.get("token");
		var result = await api.verifyAuthorizationCode(token, req.body.code);
		res.json(result);
			
	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.post('/login', async function(req, res, next) {
	try {
		var result = await api.login(req.body.email, req.body.password);
		res.json(result);
			
	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.post('/logout', async function(req, res, next) {
	try {
		var result = await api.logout(req.body.token);
		res.json(result);
			
	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.post('/verifyAccessToken', async function(req, res, next) {
	try {
		var result = await api.verifyAccessToken(req.body.token);
		res.json(result.id);
			
	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.post('/resetPassword', async function(req, res, next) {
	try {
		var result = await api.resetPassword(req.body.email);
		res.json(result);
			
	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});

router.post('/updatePassword', async function(req, res, next) {
	try {
		var token = req.get("token");
		var result = await api.updateUserPassword(token, req.body.password);
		res.json(result);
			
	} catch (err) {
		console.log("Exception", err);
		if (err.detail != undefined)
		{
			res.status(400);
  			res.json({message: err.detail, code: err.code});
		}
		else
		{
			res.status(400);
  			res.json({message: err.message });
		}
	}
});


// export the router here
module.exports = router;


