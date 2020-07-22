const run = ({messageText, sendMessage}) => {
	if (messageText.toLowerCase() === 'help') {
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
	'@ blackjack\n' +
	'@ echo\n' +
	'@ create event\n' +
	'@ list events\n' +
	'@ delete event\n' +
	'@ help\n' +
	'@ kill yourself\n' +
	'@ minecraft\n' +
	'@ name\n' +
	'@ add name\n' +
	'@ report bug\n' +
	'@ roll\n' +
	'@ shame\n' +
	'@ unshame\n' +
	'@ taboo\n' +
	'@ untaboo\n' +
	'@ what\'s new\n' +
	'\n' +
	'I know these meta-commands:\n' +
	'@ #[channel] [command]\n' +
	'@ loudly [command]\n' +
	'@ quietly [command]';


module.exports=run;
