const run = ({messageText, sendMessage}) => {
	if (['whatsnew', 'whatsup', 'sup'].includes(
		messageText.toLowerCase().replace(/[^a-z]/g, '')
	)) {
		sendMessage(patchNotes);
		return true;
	} else {
		return false;
	}

}

const patchNotes =
	'2020/07/22\n' +
	'• Bot can execute commands on a different channel than it was invoked on.\n' +
	'• Bot can handle multiple meta-commands on one command.\n' +
	'• Bot can tell when people are talking about it.\n' +
	'• Bot can now mock you, if you want.\n' +
	'2020/07/20\n' +
	'• Bot now knows two meta-commands: quietly and loudly.';

module.exports=run;
