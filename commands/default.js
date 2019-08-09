const run = ({messageText, actions}) => {
	const {sendMessage} = actions;
	sendMessage(`I cannot ${messageText}`);
	return true;
}

module.exports=run;
