const Discord = require('discord.js');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const auth = require('./auth.json');
const responses = require('./responses/index.js');
const commands = require('./commands/index.js');
const metacommands = require('./metacommands/index.js');
const emojis = require('./emojis/index.js');
const alarms = require('./alarms/index.js');
const MessageActionState = require('./MessageActionState.js');
const {log, logError, withErrorLogging} = require('./errorLogging.js');

//initialize Discord Bot
const client = new Discord.Client();
const db = new JsonDB(new Config('data', true, true, '/'));

const onReady = () => {
	log(`Logged in as ${client.user.tag}`);
	alarms.start({client, db});
};

const isMuted = () => {
	try {
		return db.getData('/muted');
	} catch (e) {
		return false;
	}
}

const onMessage = (message) => {
	if (message.author.id === client.user.id) {
		return;
	}
	const state = new MessageActionState(client, message, db);
	if (state.isCommand) {
		commands(metacommands(state));
	} else if (!isMuted()){
		responses(state);
	}
	emojis.track_message({db, message});
};

const onMessageUpdate = (oldMessage, newMessage) => {
	if (oldMessage.content !== newMessage.content) {
		onMessage(newMessage);
	}
}

const onReaction = (reaction, user) => {
	emojis.track_react({db, reaction});
}

client.on('ready', withErrorLogging(onReady));
client.on('message', withErrorLogging(onMessage));
client.on('messageUpdate', withErrorLogging(onMessageUpdate));
client.on('messageReactionAdd', withErrorLogging(onReaction));
client.on('error', logError);
client.login(auth.token);

