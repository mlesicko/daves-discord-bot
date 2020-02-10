const auth = require('../auth.json');

const run = ({messageText, sendMessage, message}) => {
	if (
		messageText.toLowerCase() === 'kill yourself' ||
		messageText.toLowerCase() === 'kys'
	) {
		if (auth.owners.includes(message.author.id)) {
			exit(sendMessage);
		} else {
			sendMessage('You are not authorized to kill me.');
		}
		return true;
	} else {
		return false;
	}
}

const exit = async (sendMessage) => {
	await sendMessage('🔫');
	process.exit(0);
}

module.exports=run;
