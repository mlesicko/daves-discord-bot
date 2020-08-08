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
	'2020/08/08\n' +
	'• Bot ignores excessive   spaces.\n' +
	'2020/07/31\n' +
	'• Edit bad commands into good ones!\n' +
	'• Improved alarm handling.\n' +
	'2020/07/24\n' +
	'• Minecraft functionality removed in favor of a dedicated Minecraft bot.';

module.exports=run;
