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
	return message.mentions.users.size && message.mentions.users.has(myId);
}

const onMessage = (message) => {
	const myId = client.user.id;
	if (message.author.id === myId) {
		return;
	}
	const messageText = message.content.replace(new RegExp(`<@!?${myId}>`),"").trim();
	const state = {
		client,
		messageText, 
		sendMessage: (s) => message.channel.send(s),
		react: (s) => message.react(s),
		message,
		db,
		myId
	};
	if (isCommand(myId, message)) {
		commands(metacommands(state));
	} else if (!isMuted()){
		responses(state);
	}
};

client.on('ready', withErrorLogging(onReady));
client.on('message', withErrorLogging(onMessage));
client.on('error', logError);
client.login(auth.token);

