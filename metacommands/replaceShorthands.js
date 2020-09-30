const { logError } = require('../errorLogging.js');

const run = (state) => {
	try {
		const shorthands = state.db.getData('/shorthands');
		let messageText = state.messageText;
		Object.keys(shorthands).forEach((shorthand) => {
			if (messageText.trim() === shorthand) {
				messageText = `echo ${shorthands[shorthand]}`;
			}
			else {
				const re = new RegExp(shorthand, 'g');
				messageText = messageText.replace(re, shorthands[shorthand]);
			}
		});
		return {
			...state,
			messageText
		};
	} catch (e) {
		logError(e);
		return state;
	}
}

module.exports=run;
