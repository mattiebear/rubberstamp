#!/usr/bin/env node

const esbuild = require('esbuild');
const path = require('path');

const main = async () => {
	const entry = path.resolve(__dirname, '../src/index.ts');

	const builds = ['cjs', 'esm'].map((format) => {
		const outfile = path.resolve(__dirname, `../dist/index.${format}.js`);

		return esbuild.build({
			entryPoints: [entry],
			bundle: true,
			outfile,
			platform: 'node',
			format,
		});
	});

	await Promise.all(builds);
};

main();
