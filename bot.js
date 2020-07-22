const Discord = require('discord.js');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const auth = require('./auth.json');
const responses = require('./responses/index.js');
const commands = require('./commands/index.js');
const metacommands = require('./metacommands/index.js');
const alarms = require('./alarms/index.js');
const {log, logError, withErrorLogging} = require('./errorLogging.js');

//initialize Discord Bot
const client = new Discord.Client();
const db = new JsonDB(new Config('data', true, true, '/'));

let muted = false;

const onReady = () => {
	log(`Logged in as ${client.user.tag}`);
	alarms.stop();
	alarms.start({client, db});
};

const isMuted = () => {
	try {
		return db.getData('/muted');
	} catch (e) {
		return false;
	}
}

const isCommand = (myId, message) => {
	const tokens = message.content.split(' ');
	return tokens.length && tokens[0].match(new RegExp(`^<@!?${myId}>$`));
}

const onMessage = (message) => {
	const myId = client.user.id;
	if (message.author.id === myId) {
		return;
	}
	const state = {
		client,
		transformMessage: (s) => s,
		sendMessage: (s) => s && message.channel.send(s),
		react: (s) => message.react(s),
		message,
		messageText: message.content,
		channel: message.channel,
		db,
		myId
	};
	if (isCommand(myId, message)) {
		state.messageText = state.messageText.split(' ').slice(1).join(' ');
		commands(metacommands(state));
	} else if (!isMuted()){
		responses(state);
	}
};

client.on('ready', withErrorLogging(onReady));
client.on('message', withErrorLogging(onMessage));
client.on('error', logError);
client.login(auth.token);

