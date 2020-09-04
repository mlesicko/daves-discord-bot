const Discord = require('discord.js');
const Canvas = require('canvas');

const run = ({messageText, channel, message}) => {
	const tokens = messageText.split(' ');
	const author = message.author;
	if (tokens.length > 0 && tokens[0].toLowerCase() === 'meme') {
		const memeText = tokens.slice(1).join(' ').trim();
        makeMeme(memeText, author)
			.then(meme => channel.send('', {files: [{attachment: meme}]}))
			.catch(e => console.log(e));
		return true;
	} else {
		return false;
	}
}

const makeMeme = async (memeText, author) => {
	const canvas = Canvas.createCanvas(1280, 720);
	const context = canvas.getContext('2d');

	const background = await Canvas.loadImage('./assets/synthwave_background.jpg');
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	writeTextToCanvas(memeText, canvas, context);

	context.beginPath();
	context.arc(1220, 660, 50, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();
	const avatar = await Canvas.loadImage(author.avatarURL);
	context.drawImage(avatar, 1170, 610, 100, 100);

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

	const words = text.split(' ');
	let buffer = words.length > 0 ? words[0] : '';
	const lines = [];
	
	context.font = textConfig.font;
	context.lineWidth = textConfig.strokeWidth;
	context.strokeStyle = textConfig.strokeColor;
	context.fillStyle = textConfig.fillColor;

	words.slice(1).forEach((word) => {
		const tempBuffer = buffer + ' ' + word;
		const width = context.measureText(tempBuffer).width + textConfig.margin * 2
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

module.exports=run;
