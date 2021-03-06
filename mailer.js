
const nodemailer = require('nodemailer');

// const config = require('./config.js')['application'];

console.log("Load mailer ...");

let mailServerHost = process.env.MAIL_SERVER_HOST;
if (mailServerHost == undefined) console.error('Please configure MAIL_SERVER_HOST');

let mailServerPort = process.env.MAIL_SERVER_PORT;
if (mailServerPort == undefined) console.error('Please configure MAIL_SERVER_PORT');

let mailServerSecure = process.env.MAIL_SERVER_SECURE == 'true' ? true: false;
if (mailServerSecure == undefined) console.error('Please configure MAIL_SERVER_SECURE (true or false)');

let mailServerUser = process.env.MAIL_SERVER_USER;
if (mailServerUser == undefined) console.error('Please configure MAIL_SERVER_USER');

let mailServerPassword = process.env.MAIL_SERVER_PASSWORD;
if (mailServerPassword == undefined) console.error('Please configure MAIL_SERVER_PASSWORD');

let mailServerExtraTLSFlag = process.env.MAIL_SERVER_EXTRA_TLS_FLAG == 'true' ? true: false;

if (mailServerExtraTLSFlag)
{
	console.log("Turn off NODE_TLS_REJECT_UNAUTHORIZED");
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}


let transporter = nodemailer.createTransport({
	host: mailServerHost,
	port: mailServerPort,
	secure: mailServerSecure, 
	auth: {
		user: mailServerUser,
		pass: mailServerPassword 
	},
});


module.exports = transporter;

