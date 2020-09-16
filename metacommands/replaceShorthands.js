const run = (state) => {
	let messageText = state.messageText;
	Object.keys(shorthands).forEach((shorthand) => {
		if (messageText.trim() === shorthand) {
			messageText = `echo ${shorthands[shorthand]}`;
		}
		else {
			const re = new RegExp(shorthand, 'g');
			messageText = messageText.replace(re, shorthands[shorthand]);
		}
	});
	return {
		...state,
		messageText
	};
}

const rot13 = (s) => s.split('').map((c) => {
	const input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	const output = 'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm'.split('');
	return input.includes(c) ? output[input.indexOf(c)] : c;
}).join('');

const shorthands = {
	'!jug': 'I did I met a man with a jug and a gun you held the gun on the inside drink when I got done drinking he wished me a gun and grab the jug and said now you hold a gun why I drink',
	'!has': 'Has anyone really been far even as decided to use even go want to do look more like?',
	'!navy': rot13(`Jung gur shpx qvq lbh whfg shpxvat fnl nobhg zr, lbh yvggyr ovgpu? V'yy unir lbh xabj V tenqhngrq gbc bs zl pynff va gur Anil Frnyf, naq V'ir orra vaibyirq va ahzrebhf frperg envqf ba Ny-Dhnrqn, naq V unir bire 300 pbasvezrq xvyyf. V nz genvarq va tbevyyn jnesner naq V'z gur gbc favcre va gur ragver HF nezrq sbeprf. Lbh ner abguvat gb zr ohg whfg nabgure gnetrg. V jvyy jvcr lbh gur shpx bhg jvgu cerpvfvba gur yvxrf bs juvpu unf arire orra frra orsber ba guvf Rnegu, znex zl shpxvat jbeqf. Lbh guvax lbh pna trg njnl jvgu fnlvat gung fuvg gb zr bire gur Vagrearg? Guvax ntnva, shpxre. Nf jr fcrnx V nz pbagnpgvat zl frperg argjbex bs fcvrf npebff gur HFN naq lbhe VC vf orvat genprq evtug abj fb lbh orggre cercner sbe gur fgbez, znttbg. Gur fgbez gung jvcrf bhg gur cngurgvp yvggyr guvat lbh pnyy lbhe yvsr. Lbh'er shpxvat qrnq, xvq. V pna or naljurer, nalgvzr, naq V pna xvyy lbh va bire frira uhaqerq jnlf, naq gung'f whfg jvgu zl oner unaqf. Abg bayl nz V rkgrafviryl genvarq va hanezrq pbzong, ohg V unir npprff gb gur ragver nefrany bs gur Havgrq Fgngrf Znevar Pbecf naq V jvyy hfr vg gb vgf shyy rkgrag gb jvcr lbhe zvfrenoyr nff bss gur snpr bs gur pbagvarag, lbh yvggyr fuvg. Vs bayl lbh pbhyq unir xabja jung haubyl ergevohgvba lbhe yvggyr "pyrire" pbzzrag jnf nobhg gb oevat qbja hcba lbh, znlor lbh jbhyq unir uryq lbhe shpxvat gbathr. Ohg lbh pbhyqa'g, lbh qvqa'g, naq abj lbh'er cnlvat gur cevpr, lbh tbqqnza vqvbg. V jvyy fuvg shel nyy bire lbh naq lbh jvyy qebja va vg. Lbh'er shpxvat qrnq, xvqqb.`),
}

module.exports=run;
