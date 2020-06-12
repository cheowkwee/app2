
console.log('Load DB ...');

let url = process.env.DB_URL;
if (url == undefined) console.error('Please configure DB_URL');
let config = {
		client: 'pg',
		connection: url,
		debug: (process.env.DB_DEBUG == 'true') ? true: false
};

// console.log(config);
module.exports = require('knex')(config);

