"use strict";

const CryptoJS = require("crypto-js");
const moment = require('moment');
// const uuid = require('uuid');
const { v4: uuidv4 } = require('uuid');

const knex = require('./db');
const mailer = require('./mailer');
const ErrorCodes = require('./error-codes');
const KarelyError = require('./karely-error');


console.log('Load Member API ...');

const normalGroupName = "KARELY";
const adminGroupName = "ADMIN";

const groupTableName = "karely_cause_group";
const causeGroupLinkTableName = "karely_cause_group_link";
const TableName = "karely_cause_member";
const sessionTableName = "karely_cause_session";

let api = {};
let FieldList = ['id', 'cause_id', 'user_id', 'admin_flag', 'status', 'created_on','updated_on'];

api.getMemberList = async function(flag) {

	if (flag == undefined) flag = false;
	let sql = knex.select(FieldList);
	sql = sql.from(TableName);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data);
	if (data.length == 0 && flag == true) return data;
	else if (data.length == 0 && flag == false) 
		throw new KarelyError(ErrorCodes.RECORD_NOT_FOUND);
	else return data;
};

api.getMember = async function(id, flag) {

	if (flag == undefined) flag = false;
	if (id == undefined) 
		throw new KarelyError(ErrorCodes.INVALID_PARAMETER);
	let sql = knex.select(FieldList);
	sql = sql.from(TableName);
	sql = sql.where("id", id);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data);

	if (data.length == 0 && flag == true) return undefined;
	else if (data.length == 0 && flag == false) 
		throw new KarelyError(ErrorCodes.Member_NOT_FOUND);

	return data[0];
};

api.getCauseMember = async function(id, flag) {
	if (flag == undefined) flag = false;
	if (id == undefined) 
		throw new KarelyError(ErrorCodes.INVALID_PARAMETER);
	let sql = knex.select(FieldList);
	sql = sql.from(TableName);
	sql = sql.where("cause_id", id);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data);

	if (data.length == 0 && flag == true) return undefined;
	else if (data.length == 0 && flag == false) 
		throw new KarelyError(ErrorCodes.RECORD_NOT_FOUND);

	return data;
};

api.searchMember = async function(req, flag) {
	
	let sql = knex.select(FieldList);
	sql = sql.from(TableName);
	sql = sql.where("cause_id", req.cause_id).andWhere("user_id", req.user_id);
	console.log("SQL:", sql.toString());

	let data = await sql;
	console.log("Data:", data);

	if (data.length == 0 && flag == true) return undefined;
	else if (data.length == 0 && flag == false) 
		throw new KarelyError(ErrorCodes.RECORD_NOT_FOUND);

	return data;
};


api.addMember = async function(data)
{
	let result = await knex(TableName).insert(data).returning('*'); 
	if (result.length == 0) 
		throw new KarelyError(ErrorCodes.INSERT_FAIL);
	else return result[0];
};

api.approveMember = async function(data, id)
{
	let result = await knex(TableName).update(data).where({ 'id': id }).returning('id'); 
	
	if (result.length == 0) 
		throw new KarelyError(ErrorCodes.INSERT_FAIL);
	else return result[0];
};

api.updateMemberWithID = async function(data, id)
{
	let result = await knex(TableName).update(data).where({ 'id': id }).returning('id'); 
	if (result.length == 0) 
		throw new KarelyError(ErrorCodes.UPDATE_FAIL);
	else return result[0];
};

api.deleteMemberWithID = async function(id)
{
	let result = await knex(TableName).where({ 'id': id }).delete().returning('id'); 
	if (result.length == 0) 
		throw new KarelyError(ErrorCodes.DELETE_FAIL);
	return result[0];
};

module.exports = api;

