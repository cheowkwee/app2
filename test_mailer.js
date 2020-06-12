const nodemailer = require('nodemailer');

require('dotenv').config();

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


let mailOptions = {
	from: mailServerUser,
	to: 'cheowkwee@hotmail.com',
	subject: 'Sending Email using Node.js',
	text: 'That was easy! ' + new Date()
};


var main = async function() {
	/*
	transporter.sendMail(mailOptions, function(error, info) {
	 	if (error) console.log(error);
	 	else console.log('Email sent: ' + info.response);
	});
	*/
	var result = await transporter.sendMail(mailOptions); 
	console.log("Message ID:", result.messageId);
	console.log("Result:", result);

	return;
};

main().catch(console.error);

