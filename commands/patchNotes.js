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
	'2020/09/15\n' +
	'• User avatar appears behind meme text.\n' +
	'• Ability to delete bugs through Discord.\n' +
	'2020/09/04\n' +
	'• Bot can now make memes.\n';

module.exports=run;
