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
			.addChoice("synthwave", "synthwave")
			.addChoice("boomer post", "boomer_post")
			.setRequired(false))
	.toJSON();

const backgroundDataMap = {
	"synthwave": {
		file: "synthwave_background.jpg",
		config: {
			height: 720,
			width: 1280
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
				yFunc: (canvasHeight, lineIndex, lineCount) =>
					200 + lineIndex * 50 - 10 * lineCount
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
		canvasHeight * ((lineIndex + 1) /  (lineCount + 1))
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
	const backgroundImage = await Canvas.loadImage(`./assets/${background.file}`);

	const canvas = Canvas.createCanvas(
		background.config.width, background.config.height
	);
	const context = canvas.getContext('2d');
	context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

	context.save();
	context.beginPath();
	context.arc(canvas.width - 60, canvas.height - 60, 50, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();
	const avatar = await Canvas.loadImage(author.displayAvatarURL({ format: "jpg" }));
	context.drawImage(avatar, canvas.width - 110, canvas.height - 110, 100, 100);
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
		y = textConfig.yFunc(canvas.height, idx, lines.length)
		textMeasure = context.measureText(line);
		context.fillText(
			line, 
			canvas.width / 2 - textMeasure.width / 2,
			y
		);
		context.strokeText(
			line, 
			canvas.width / 2 - textMeasure.width / 2,
			y,
		);
	});
}

module.exports={ run, data };
