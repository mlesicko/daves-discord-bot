const run = ({messageText, react}) => {
	if (messageText.toLowerCase().includes('old town road')) {
		react('🤠');
		return true;
	} else {
		return false;
	}
}

module.exports=run;
