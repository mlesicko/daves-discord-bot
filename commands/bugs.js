const run = ({messageText, sendMessage, db}) => {
	const tokens = messageText.split(' ');
	if (
		tokens.length > 2 &&
		(
			tokens[0] === 'bug' && tokens[1] === 'report' ||
			tokens[0] === 'report' && tokens[1] === 'bug'
		)
	) {
		reportBug(tokens.slice(2).join(' '), sendMessage, db);
		return true;
	} else if (
		tokens.length > 0 &&
		(['bug','report-bug','bug-report'].includes(tokens[0]))
	) {
		reportBug(tokens.slice(1).join(' '), sendMessage, db);
		return true;
	} else {
		return false;
	}
}

const reportBug = (bug, sendMessage, db) => {
	db.push('/bugs', [bug], false);
	sendMessage('Added bug: ' + bug);
}

module.exports=run;
