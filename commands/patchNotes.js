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
	'2019/12/18\n' +
	'• Added echo command.\n' +
	'• Fixed bug where bot got confused by its own name.\n';

module.exports=run;
