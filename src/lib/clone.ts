import { copyFile, lstat, mkdir, readdir, stat } from 'fs/promises';
import path from 'path';

export type Injection = Record<string, string | number>;

export interface CloneConfig {
	inject?: Injection;
}

export const clone = async (
	source: string,
	destination: string,
	config: CloneConfig = {}
) => {
	try {
		await stat(destination);
	} catch (err) {
		mkdir(destination);
	}

	const contents = await readdir(source);

	for (const name of contents) {
		const fullPath = path.join(source, name);
		const targetPath = path.join(destination, name);
		const stat = await lstat(fullPath);

		if (stat.isDirectory()) {
			await clone(fullPath, targetPath);
		} else {
			await copyFile(fullPath, targetPath);
		}
	}
};
