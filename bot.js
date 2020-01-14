const Discord = require('discord.js');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const auth = require('./auth.json');
const selfDirectedActions = require('./actions/index.js');
const commands = require('./commands/index.js');

//initialize Discord Bot
const client = new Discord.Client();
const db = new JsonDB(new Config('data', true, true, '/'));

let muted = false;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {

	const myId = client.user.id;
	if (message.author.id === myId) {
		return;
	}

	if (
		message.mentions.users.size &&
		message.mentions.users.has(myId)
	) {
		const actions = {
			sendMessage: (s) => message.channel.send(s),
			react: (s) => message.react(s)
		}
		const messageText = message.content.replace(new RegExp(`<@!?${myId}>`),"").trim();
		if (
			messageText === "mute" ||
			messageText === "shutup" ||
			messageText === "shut up"
		) {
			muted = true;
		} else if (messageText === "unmute" || messageText === "speak up") {
			muted = false;
			message.channel.send('I\'m here!');
		} else {
			commands({
				client,
				messageText, 
				...actions, 
				message,
				db,
				myId
			});
		}
	} else {
		const actions = {
			sendMessage: muted ? (_) => {} : (s) => message.channel.send(s),
			react: muted ? (_) => {} : (s) => message.react(s)
		}
		selfDirectedActions({
			client,
			messageText: message.content, 
			...actions, 
			message,
			db,
			myId 
		});
	}
});

client.login(auth.token);

