const { logError } = require('../errorLogging.js');

const run = ({messageText, sendMessage, db}) => {
	const addPattern = /(?:add )?shorthand (\S+) (.+)/i;
	const addMatch = messageText.match(addPattern);
	const deletePattern = /delete shorthand (\S+)/i;
	const deleteMatch = messageText.match(deletePattern);
	const listPattern = /list shorthands?/i;
	const listMatch = messageText.match(listPattern);
	if (addMatch) {
		let [_, shorthand, text] = addMatch;
		if (shorthand === '!') {
			sendMessage('! is not a valid shorthand identifier');
			return true;
		} else if (!shorthand.startsWith('!')) {
			sendMessage('Shorthands must begin with \'!\'. Adding one for you.');
			shorthand = '!' + shorthand;
		}
		addShorthand(shorthand, text, sendMessage, db);
		return true;
	} else if (deleteMatch) {
		let [_, shorthand] = deleteMatch;
		if (!shorthand.startsWith('!')) {
			shorthand = '!' + shorthand;
		}
		deleteShorthand(shorthand, sendMessage, db);
		return true;
	} else if (listMatch) {
		listShorthands(sendMessage, db);
		return true;
	} else {
		return false;
	}
}

const addShorthand = (shorthand, text, sendMessage, db) => {
	db.push(`/shorthands/${shorthand}`, text, false);
	sendMessage(`Added shorthand: ${shorthand} — ${text}`);
}

const listShorthands = (sendMessage, db) => {
	try {
		const shorthands = db.getData('/shorthands');
		if (shorthands && Object.keys(shorthands).length > 0) {
			sendMessage(
				Object.keys(shorthands).map(
					(shorthand) => `${shorthand} — ${shorthands[shorthand]}`
				).join('\n')
			);
		} else {
			sendMessage('No shorthands currently exist.');
		}
	} catch (e) {
		logError(e);
		sendMessage('No shorthands currently exist.');
	}
}

const deleteShorthand = (shorthand, sendMessage, db) => {
	try {
		const shorthands = db.getData('/shorthands');
		if (shorthand in shorthands) {
			db.delete(`/shorthands/${shorthand}`);
			sendMessage(`Shorthand ${shorthand} deleted.`);
		} else {
			sendMessage(`No shorthand for ${shorthand} exists.`);
		}
	} catch (e) {
		logError(e);
		sendMessage(`Encountered an error. Shorthand ${shorthand} probably not deleted.`);
	}
}


module.exports=run;
