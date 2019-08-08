const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');

const db = new JsonDB(new Config('data', true, true, '/'));

const run = (message, { sendMessage }) => {
	const tokens = message.split(' ');
	if (
		tokens.length > 0 &&
		(['bug','report-bug','bug-report'].includes(tokens[0]))
	) {
		reportBug(tokens.slice(1).join(' '), sendMessage);
		return true;
	} else if (
		tokens.length > 2 &&
		(
			tokens[0] === 'bug' && tokens[1] === 'report' ||
			tokens[0] === 'report' && tokens[1] === 'bug'
		)
	) {
		reportBug(tokens.slice(2).join(' '), sendMessage);
		return true;
	} else {
		return false;
	}
}

const reportBug = (bug, sendMessage) => {
	db.push('/bugs', [bug], false);
	sendMessage('Added bug: ' + bug);
}

module.exports=run;
