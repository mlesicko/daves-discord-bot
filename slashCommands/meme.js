const { SlashCommandBuilder } = require('@discordjs/builders');
const Canvas = require('canvas');

const data = new SlashCommandBuilder()
	.setName("meme")
	.setDescription("Create a meme image.")
	.addStringOption(option =>
		option.setName("text")
			.setDescription("The text to use in the meme.")
			.setRequired(true))
	.toJSON();

const run = ({ interaction }) => {
	const text = interaction.options.getString("text");
	interaction.reply({ content: "Generating meme...", ephemeral: true });
	makeMeme(text, interaction.user)
		.then(meme => interaction.channel.send({files: [{attachment: meme}]}))
		.catch(e => console.log(e));
}

const makeMeme = async (memeText, author) => {
	const canvas = Canvas.createCanvas(1280, 720);
	const context = canvas.getContext('2d');

	const background = await Canvas.loadImage('./assets/synthwave_background.jpg');
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	context.save();
	context.beginPath();
	context.arc(1220, 660, 50, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();
	const avatar = await Canvas.loadImage(author.displayAvatarURL({ format: "jpg" }));
	context.drawImage(avatar, 1170, 610, 100, 100);
	context.restore()

	writeTextToCanvas(memeText, canvas, context);

	return canvas.toBuffer();
}

const writeTextToCanvas = (
		text, 
		canvas,
		context,
		textConfig = {}
	) => {
	const defaultTextConfig = {
		margin: 20,
		font: 'bold 80px sans-serif',
		strokeColor: '#0000ff',
		fillColor: '#00f2ffA0',
		strokeWidth: 2.5,
		yFunc: (canvasHeight, lineIndex, lineCount) =>
			canvasHeight * ((lineIndex + 1) /  (lineCount + 1))
	}
	
	textConfig = {
		...textConfig,
		...defaultTextConfig
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
