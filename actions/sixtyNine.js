const run = (message, { sendMessage }) => {
	if (message.includes('69')) {
		sendMessage('Nice!');
		return true;
	} else {
		return false;
	}
}

module.exports=run;
