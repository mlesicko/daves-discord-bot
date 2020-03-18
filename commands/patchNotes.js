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
	'2020/03/18\n' +
	'• Added blackjack functionality.\n' +
	'2020/01/13\n' +
	'• Added Minecraft command.\n' +
	'• Bot will let us know when Alex\'s IP address changes.\n' +
	'2019/12/24\n' +
	'• Added dice rolling command.\n' +
	'• Added taboo and untaboo commands.\n' +
	'2019/12/18\n' +
	'• Added echo command.\n' +
	'• Fixed bug where bot got confused by its own name.\n';

module.exports=run;
