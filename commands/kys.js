const auth = require('../auth.json');

const run = ({messageText, actions, message}) => {
	const {sendMessage} = actions;
	if (messageText === 'kill yourself' || messageText === 'kys') {
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
