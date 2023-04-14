import { lstat, mkdir, readFile, readdir, stat, writeFile } from 'fs/promises';
import path from 'path';

import { injectData } from '@/lib/inject';
import { Injection } from '@/types';

type Pattern = string | RegExp;

export interface CloneConfig {
	ignorePattern?: Pattern | Pattern[];
	inject?: Injection;
}

export const matcherFn = (pattern?: Pattern | Pattern[]) => (name: string) => {
	if (!pattern) {
		return false;
	}

	const patterns = ([] as Pattern[]).concat(pattern);

	return patterns.some((pattern) => {
		const matcher = pattern instanceof RegExp ? pattern : new RegExp(pattern);
		return matcher.test(name);
	});
};

export const clone = async (
	source: string,
	destination: string,
	{ ignorePattern, inject }: CloneConfig = {}
) => {
	try {
		await stat(destination);
	} catch (err) {
		mkdir(destination);
	}

	const matches = matcherFn(ignorePattern);

	const contents = await readdir(source);

	for (const name of contents) {
		const newName = injectData(name, inject).replace(/\.template$/, '');

		if (matches(newName)) {
			continue;
		}

		const sourcePath = path.join(source, name);
		const targetPath = path.join(destination, newName);
		const stat = await lstat(sourcePath);

		if (stat.isDirectory()) {
			await clone(sourcePath, targetPath, { ignorePattern, inject });
		} else {
			const contents = await readFile(sourcePath, { encoding: 'utf8' });
			const injectedContents = injectData(contents, inject);
			await writeFile(targetPath, injectedContents);
		}
	}
};
