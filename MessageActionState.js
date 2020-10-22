class MessageActionState {
	constructor (client, message, db) {
		this.client = client;
		this.message = message;
		this.db = db;

		this.react = (s) => message.react(s);
		this.channel = message.channel;
		this.myId = client.user.id;

		this.sendFn = (s) => message.channel.send(s);
		this.transformFn = (s) => s;

        this.messageText = message.content.replace(/' '+/g, ' ')
        if (this.isCommand) {
            this.messageText = this.messageText.split(' ').slice(1).join(' ');
        }
	}

	applyTransformFn(newTransformFn) {
		const currentTransformFn = this.transformFn;
		this.transformFn = (message) => newTransformFn(currentTransformFn(message));
	}

	get isCommand() {
	    const tokens = this.message.content.split(' ');
	    return tokens.length && tokens[0].match(new RegExp(`^<@!?${this.myId}>$`));
	}

	get sendMessage() {
		const {sendFn, transformFn} = this;
		return (message) => {
			const transformedMessage = transformFn(message);
			if (transformedMessage) {
				sendFn(transformedMessage);
			}
		}
	}
}

module.exports=MessageActionState;
