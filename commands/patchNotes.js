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
	'2020/04/26\n' +
	'• Minecraft is now an alarm rather than an action.\n' +
	'• Actions renamed to responses.\n' +
	'2020/04/25\n' +
	'• Event functionality.\n' +
	'2020/04/09\n' +
	'• Respond appropriately to additional meme number.\n' +
	'2020/03/31\n' +
	'• Improved error logging.\n' +
	'• Fixed bug where users couldn\'t be shamed.\n' +
	'2020/03/23\n' +
	'• Minecraft server changes will now properly update the topic.\n' +
	'• Fixed pluralization error in taboo response.\n' +
	'2020/03/18\n' +
	'• Added blackjack functionality.\n';

module.exports=run;
