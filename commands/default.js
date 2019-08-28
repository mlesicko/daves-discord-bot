const run = ({messageText, sendMessage}) => {
	sendMessage(`I cannot ${messageText}`);
	return true;
}

module.exports=run;
