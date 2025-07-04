const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const auth = require('./auth.json');
const responses = require('./responses/index.js');
const embedResponses = require('./responses/embedResponses.js');
const commands = require('./commands/index.js');
const emojis = require('./emojis/index.js');
const alarms = require('./alarms/index.js');
const slashCommands = require('./slashCommands/index.js');
const MessageActionState = require('./MessageActionState.js');
const {log, logError, withErrorLogging} = require('./errorLogging.js');

//initialize Discord Bot
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages
	],
	partials: [
		Partials.Channel
	]
});
const db = new JsonDB(new Config('data', true, true, '/'));

const onReady = () => {
	log(`Logged in as ${client.user.tag}`);
	alarms.start({client, db});
};

const isMuted = async () => {
	try {
		const muted = await db.getData('/muted');
		return muted;
	} catch (e) {
		return false;
	}
}

const onMessage = async (message) => {
	if (message.author.id === client.user.id) {
		return;
	}
	const state = new MessageActionState(client, message, db);
	if (state.isCommand) {
		commands(state);
	} else if (!(await isMuted())){
		responses(state);
	}
	emojis.track_message({db, message});
};

const onMessageEmbedsUpdate = (message) => {
    if (message.author.id === client.user.id) {
        return;
    }
    const state = new MessageActionState(client, message, db);
    if (!state.isCommand && !isMuted()) {
        embedResponses(state);
    }

}

const onMessageUpdate = (oldMessage, newMessage) => {
	if (oldMessage.content !== newMessage.content) {
		onMessage(newMessage);
	} else if (oldMessage.embeds.length !== newMessage.embeds.length) {
		onMessageEmbedsUpdate(newMessage)
	}
}

const onReaction = (reaction, user) => {
	emojis.track_react({db, reaction});
}

const onInteraction = (interaction) => {
	if (interaction.isCommand()) {
		const state = {
			client,
			interaction,
			db
		};
		slashCommands(state);
	}
}

client.on('ready', withErrorLogging(onReady));
client.on('messageCreate', withErrorLogging(onMessage));
client.on('messageUpdate', withErrorLogging(onMessageUpdate));
client.on('messageReactionAdd', withErrorLogging(onReaction));
client.on('interactionCreate', withErrorLogging(onInteraction));
client.on('error', logError);
client.login(auth.token);

