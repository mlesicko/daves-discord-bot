const { logError } = require('../errorLogging.js');

const run = ({messageText, sendMessage, db}) => {
	const tokens = messageText.split(' ');
	const token0 = tokens.length > 0 && tokens[0].toLowerCase();
	const token1 = tokens.length > 1 && tokens[1].toLowerCase();
	if (
		token0 === 'bug' && token1 === 'report' ||
		token0 === 'report' && token1 === 'bug' ||
		token0 === 'add' && token1 === 'bug'
	) {
		reportBug(tokens.slice(2).join(' '), sendMessage, db);
		return true;
	} else if (
		['bug','report-bug','bug-report'].includes(token0)
	) {
		reportBug(tokens.slice(1).join(' '), sendMessage, db);
		return true;
	} else if (
		messageText.toLowerCase() === 'list bugs' ||
		messageText.toLowerCase() === 'list-bugs'
	) {
		listBugs(sendMessage, db);
		return true;
	} else {
		return false;
	}
}

const reportBug = (bug, sendMessage, db) => {
	db.push('/bugs', [bug], false);
	sendMessage('Added bug: ' + bug);
}

const listBugs = (sendMessage, db) => {
	try {
		const bugs = db.getData('/bugs');
		if (bugs && bugs.length > 0) {
			sendMessage(bugs.map((bug) => `• ${bug}`).join('\n'));
		} else {
			sendMessage('No bugs have been reported');
		}
	} catch (e) {
		logError(e);
		sendMessage('No bugs have been reported');
	}
}

module.exports=run;
