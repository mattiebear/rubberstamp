import { lstat, mkdir, readFile, readdir, stat, writeFile } from 'fs/promises';
import path from 'path';

import { injectData } from '@/lib/inject';
import { Injection } from '@/types';

export interface CloneConfig {
	inject?: Injection;
}

export const clone = async (
	source: string,
	destination: string,
	{ inject }: CloneConfig = {}
) => {
	try {
		await stat(destination);
	} catch (err) {
		mkdir(destination);
	}

	const contents = await readdir(source);

	for (const name of contents) {
		const newName = injectData(name, inject);

		const sourcePath = path.join(source, name);
		const targetPath = path.join(destination, newName);
		const stat = await lstat(sourcePath);

		if (stat.isDirectory()) {
			await clone(sourcePath, targetPath);
		} else {
			const contents = await readFile(sourcePath, { encoding: 'utf8' });
			const injectedContents = injectData(contents, inject);
			await writeFile(targetPath, injectedContents);
		}
	}
};
