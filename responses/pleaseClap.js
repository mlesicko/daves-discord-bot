const run = ({message}) => {
	if (
		message.type === "REPLY" &&
		message.content.match(/^ *p[lw]ease c[lw]ap\.? *$/i)
	) {
		clapAtRepliedMessage(message);
		return true;
	}
	return false;
}

const clapAtRepliedMessage = async (message) => {
	const messageToClap = await message.fetchReference();
	if (messageToClap) {
		messageToClap.react("👏");
	}
}

module.exports=run;
