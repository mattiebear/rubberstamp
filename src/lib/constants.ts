const extensions = [
	'gif',
	'jpg',
	'jpeg',
	'png',
	'wav',
	'mp3',
	'ttf',
	'otf',
	'woff',
	'pdf',
];

export const copyPattern = extensions.map((ext) => new RegExp(`.${ext}$`));
