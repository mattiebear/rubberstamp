import { fs } from 'memfs';

const { copyFile, lstat, mkdir, readdir, stat } = fs.promises;

export { copyFile, lstat, mkdir, readdir, stat };
