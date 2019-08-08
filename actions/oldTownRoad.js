const run = (message, { react }) => {
	if (message.toLowerCase().includes('old town road')) {
		react('🤠');
		return true;
	} else {
		return false;
	}
}

module.exports=run;
