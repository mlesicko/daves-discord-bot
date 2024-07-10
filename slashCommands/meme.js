const { SlashCommandBuilder } = require('@discordjs/builders');
const Canvas = require('canvas');

const { getRandInt } = require('../utils.js');

const data = new SlashCommandBuilder()
	.setName("meme")
	.setDescription("Create a meme image.")
	.addStringOption(option =>
		option.setName("text")
			.setDescription("The text to use in the meme.")
			.setRequired(true))
	.addStringOption(option =>
		option.setName("background")
			.setDescription("The background to use for the meme.")
			.addChoices(
				{ name: "synthwave", value: "synthwave"},
				{ name: "boomer post", value: "boomer_post"},
				{ name: "space cowboy", value: "space_cowboy"}
			)
			.setRequired(false))
	.toJSON();

const backgroundDataMap = {
	"synthwave": {
		file: "synthwave_background.jpg",
		config: {
			height: 720,
			width: 1280,
		}
	},
	"boomer_post": {
		file: "boomer_post_background.jpg",
		config: {
			height: 634,
			width: 640,
			text: {
				margin: 45,
				font: 'bold 40px sans-serif',
				strokeColor: '#0000',
				fillColor: '#000',
				strokWidth: 0,
				yFunc: (canvasHeight,  lineIndex, lineCount) =>
					200 + lineIndex * 50 - 10 * lineCount,
			}
		}
	},
	"space_cowboy": {
		background_color: '#000',
		config: {
			height: 720,
			width: 1080,
			avatar_x: 10,
			avatar_y: 10,
			text: {
				margin: 150,
				font: 'bold italic 30px serif',
				strokeColor: '#0000',
				fillColor: '#fff',
				strokeWidth: 0,
				yFunc: (canvasHeight, lineIndex, lineCount) =>
					canvasHeight - ((40) * (lineCount - lineIndex)),
				xFunc: (canvasWidth, lineWidth, lineIndex, linesCount) =>
					canvasWidth - lineWidth - 20
			}
		}
	}
}

const defaultTextConfig = {
	margin: 20,
	font: 'bold 80px sans-serif',
	strokeColor: '#0000ff',
	fillColor: '#00f2ffA0',
	strokeWidth: 2.5,
	yFunc: (canvasHeight, lineIndex, lineCount) =>
		canvasHeight * ((lineIndex + 1) /  (lineCount + 1)),
	xFunc: (canvasWidth, lineWidth, lineIndex, linesCount) =>
		(canvasWidth / 2) - (lineWidth / 2)
}

const run = ({ interaction }) => {
	const text = interaction.options.getString("text");
	const backgroundId = interaction.options.getString("background");
	interaction.reply({ content: "Generating meme...", ephemeral: true });
	makeMeme(text, backgroundId, interaction.user)
		.then(meme => interaction.channel.send({files: [{attachment: meme}]}))
		.catch(e => console.log(e));
}


const getBackground = (backgroundId) => {
	if (backgroundId in backgroundDataMap) {
		return backgroundDataMap[backgroundId];
	} else {
		const backgroundData = Object.values(backgroundDataMap);
		return backgroundData[getRandInt(backgroundData.length)];
	}
}

const makeMeme = async (memeText, backgroundId, author) => {
	const background = getBackground(backgroundId);

	const canvas = Canvas.createCanvas(
		background.config.width, background.config.height
	);
	const context = canvas.getContext('2d');

	if (background.file) {
		const backgroundImage = await Canvas.loadImage(`./assets/${background.file}`);
		context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
	} else if (background.background_color) {
		context.fillStyle = background.background_color;
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

	context.save();
	context.beginPath();
	const avatar_x = background.config.avatar_x ?? canvas.width - 110;
	const avatar_y = background.config.avatar_y ?? canvas.height - 110;
	context.arc(avatar_x + 50, avatar_y + 50, 50, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();
	const avatar = await Canvas.loadImage(author.displayAvatarURL({ extension: "jpg", size: 128 }));
	context.drawImage(avatar, avatar_x, avatar_y, 100, 100);
	context.restore()

	writeTextToCanvas(memeText, canvas, context, background.config?.text);

	return canvas.toBuffer();
}

const writeTextToCanvas = (
		text, 
		canvas,
		context,
		textConfig
	) => {
	
	textConfig = {
		...defaultTextConfig,
		...textConfig
	};

	const words = text.replace(/\n/g, ' \n ').split(' ');
	let buffer = words.length > 0 ? words[0] : '';
	const lines = [];
	
	context.font = textConfig.font;
	context.lineWidth = textConfig.strokeWidth;
	context.strokeStyle = textConfig.strokeColor;
	context.fillStyle = textConfig.fillColor;

	words.slice(1).forEach((word) => {
		if (word === '\n') {
			lines.push(buffer);
			buffer = '';
			return;
		}
		const tempBuffer = (buffer.length > 0 ? buffer + ' ' : '') + word;
		const width = context.measureText(tempBuffer).width + textConfig.margin * 2;
		if (width < canvas.width) {
			buffer = tempBuffer;
		} else {
			lines.push(buffer);
			buffer = word;
		}
	});
	if (buffer.length > 0) {
		lines.push(buffer);
	}
	
	lines.forEach((line,idx) => {
		textMeasure = context.measureText(line);
		x = textConfig.xFunc(canvas.width, textMeasure.width, idx, lines.length);
		y = textConfig.yFunc(canvas.height, idx, lines.length);
		context.fillText(line, x, y);
		context.strokeText(line, x, y);
	});
}

module.exports={ run, data };
