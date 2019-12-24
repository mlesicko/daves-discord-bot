const run = ({messageText, sendMessage}) => {
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
	'@ echo\n' +
	'@ help\n' +
	'@ kill yourself\n' +
	'@ name\n' +
	'@ add name\n' +
	'@ report bug\n' +
	'@ shame\n' +
	'@ unshame\n' +
	'@ taboo\n' +
	'@ untaboo\n' +
	'@ what\'s new';


module.exports=run;
