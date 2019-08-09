const run = ({messageText, actions}) => {
	const {react} = actions;
	if (messageText.toLowerCase().includes('old town road')) {
		react('🤠');
		return true;
	} else {
		return false;
	}
}

module.exports=run;
