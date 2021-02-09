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
		['bug','report-bug','bug-report', 'add-bug'].includes(token0)
	) {
		reportBug(tokens.slice(1).join(' '), sendMessage, db);
		return true;
	} else if (
		token0 === 'request' && token1 === 'feature'
	) {
		reportBug(tokens.slice(2).join(' '), sendMessage, db, 'Requested feature');
		return true;
	} else if (
		token0 === 'request-feature'
	) {
		reportBug(tokens.slice(1).join(' '), sendMessage, db, 'Requested feature');
		return true;
	} else if (
		messageText.toLowerCase() === 'list bugs' ||
		messageText.toLowerCase() === 'list-bugs'
	) {
		listBugs(sendMessage, db);
		return true;
	} else if (
		token0 === 'resolve-bug' ||
		token0 === 'resolve-bugs' ||
		token0 === 'delete-bug' ||
		token0 === 'delete-bugs'
	) {
		deleteBugs(sendMessage, db, tokens.slice(1));
		return true;
	} else if (
		token0 === 'delete' && (token1 === 'bug' || token1 === 'bugs') ||
		token0 === 'resolve' && (token1 === 'bug' || token1 === 'bugs')
	) {
		deleteBugs(sendMessage, db, tokens.slice(2));
		return true;
	} else {
		return false;
	}
}

const reportBug = (bug, sendMessage, db, message='Added bug') => {
	db.push('/bugs', [bug], false);
	sendMessage(`${message}: ${bug}`);
}

const listBugs = (sendMessage, db) => {
	try {
		const bugs = db.getData('/bugs');
		if (bugs && bugs.length > 0) {
			sendMessage(bugs.map((bug, idx) => `${idx +1}. ${bug}`).join('\n'));
		} else {
			sendMessage('No bugs have been reported');
		}
	} catch (e) {
		logError(e);
		sendMessage('No bugs have been reported');
	}
}

const deleteBugs = (sendMessage, db, toDelete) => {
	const bugs = db.getData('/bugs');
	let errorFlag = false;
	toDelete.forEach((deleteIndex) => {
		if (bugs[deleteIndex - 1] != undefined) {
			bugs[deleteIndex - 1] = null;
		} else {
			errorFlag = true;
		}
	});
	const updatedBugs = bugs.filter((e) => e != null);
	if (errorFlag) {
		sendMessage('Please specify the bugs to be deleted by their numbers.');
	} else if (bugs.length === updatedBugs.length) {
		sendMessage('No bugs deleted');
	} else {
		db.push('/bugs', updatedBugs, true);
		listBugs(sendMessage, db);
	}
}


module.exports=run;
