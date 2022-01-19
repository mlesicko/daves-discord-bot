const { PATCH_NOTES } = require("../assets/strings.js");

const run = ({messageText, sendMessage}) => {
	if (['whatsnew', 'whatsup', 'sup'].includes(
		messageText.toLowerCase().replace(/[^a-z]/g, '')
	)) {
		sendMessage(PATCH_NOTES);
		return true;
	} else {
		return false;
	}

}

module.exports=run;
