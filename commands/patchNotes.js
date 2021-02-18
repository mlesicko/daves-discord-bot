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
	'2021/02/18\n' +
	'• Track emojis in messages as well as reacts.\n' +
	'• Update tracked emoji names if they change on the server.\n' +
	'2021/02/08\n' +
	'• Added emoji tracking.\n' +
	'2021/01/30\n' +
	'• Added alias "request feature" for "report bug".\n';

module.exports=run;
