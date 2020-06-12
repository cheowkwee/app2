"use strict";

module.exports = {
  DELETE_FAIL: {statusCode: 400, message: 'Delete Fail'},
  INSERT_FAIL: {statusCode: 400, message: 'Insert Fail'},
  INVALID_PARAMETER: {statusCode: 400, message: 'Invalid Parameter'},
  INVALID_ACCESS: {statusCode: 403, message: 'Invalid Access or Forbidden'},
  INVALID_STATUS: {statusCode: 400, message: 'Invalid Status'},
  INVALID_CODE: {statusCode: 400, message: 'Invalid Code'},
  INVALID_TOKEN: {statusCode: 401, message: 'Invalid Token or Session'},
  INVALID_PASSWORD: {statusCode: 400, message: 'Invalid Password'},
  RECORD_NOT_FOUND: {statusCode: 400, message: 'Record Not Found'},
  RECORD_ALREADY_EXISTS: {statusCode: 400, message: 'Record Already Exists'},
  REQUEST_VERIFICATION: {statusCode: 560, message: 'Request Verification'},
  UPDATE_FAIL: {statusCode: 400, message: 'Update Fail'},
  USER_NOT_FOUND: {statusCode: 400, message: 'User Not Found'}
};

