const run = ({messageText, sendMessage}) => {
	sendMessage(`I'm sorry, Dave, I can't ${messageText}`);
	return true;
}

module.exports=run;
