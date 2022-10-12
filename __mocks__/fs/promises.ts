import { fs } from 'memfs';

const { copyFile, lstat, mkdir, readdir, readFile, stat, writeFile } =
	fs.promises;

export { copyFile, lstat, mkdir, readdir, readFile, stat, writeFile };
