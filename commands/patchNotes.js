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
	'2021/10/04\n' +
	'• Slash command to report emoji usage.\n';
	'2021/10/04\n' +
	'• First supported slash command: Patch notes!\n';

module.exports=run;
