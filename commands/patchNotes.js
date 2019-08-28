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
	'8/28/19:\n' +
	'• Shaming is channel-specific.\n' +
	'• Bot no longer talks to itself.\n' +
	'8/18/19:\n' +
	'• Shame command added.\n' +
	'8/08/19:\n' +
	'• Improved database logic.\n' +
	'• Fix for exploding head 69 bug.\n' +
	'8/03/19:\n' +
	'• Added names command.\n' +
	'• Added report bug command.\n' +
	'8/02/19:\n' +
	'• Added mute/unmute commands.\n' +
	'• Added kill command.\n' +
	'• Added patch notes command.\n' +
	'• Added help command.\n' +
	'• Added advice command.\n';

module.exports=run;
