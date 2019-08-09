const run = ({messageText, actions}) => {
	const {sendMessage} = actions;
	if (messageText === 'help') {
		sendMessage(helpMessage);
		return true;
	} else {
		return false;
	}
}

const helpMessage =
	'I know these commands:\n' +
	'@ advice\n' +
	'@ add advice\n' +
	'@ help\n' +
	'@ kill yourself\n' +
	'@ name\n' +
	'@ add name\n' +
	'@ report bug\n' +
	'@ what\'s new';


module.exports=run;
