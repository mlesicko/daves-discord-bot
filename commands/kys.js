const auth = require('../auth.json');

const run = ({client, messageText, sendMessage, message}) => {
	if (
		messageText.toLowerCase() === 'kill yourself' ||
		messageText.toLowerCase() === 'kys'
	) {
		if (auth.owners.includes(message.author.id)) {
			exit(client, sendMessage);
		} else {
			sendMessage('You are not authorized to kill me.');
		}
		return true;
	} else {
		return false;
	}
}

const exit = async (client, sendMessage) => {
	await sendMessage('🔫');
	client.destroy();
	process.exit(0);
}

module.exports=run;
