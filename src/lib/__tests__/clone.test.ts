import { fs, vol } from 'memfs';

import { clone } from '../clone';

const simpleStructure = {
	'./templates/foo.txt': 'bar',
	'./templates/bar/foo.txt': 'boof',
	'./templates/bar/baz/foo.txt': 'boop',
};

const existingStructure = {
	...simpleStructure,
	'./tmp/foo.txt': 'boo',
	'./tmp/bar/foo.txt': 'boo',
	'./tmp/bar/baz/foo.txt': 'boo',
};

const injectedStructure = {
	'./templates/__name__.txt': 'bar',
	'./templates/foo.txt': '__name__',
	'./templates/__name__/foo.txt': 'boof',
};

const caseStructure = {
	'./templates/__name:p__.txt': 'bar',
	'./templates/foo.txt': '__name:p__',
	'./templates/__name:p__/foo.txt': 'boof',
};

beforeEach(() => vol.reset());

it('returns a promise', () => {
	vol.fromJSON(simpleStructure);

	const result = clone('./templates', './tmp');

	expect(result).toBeInstanceOf(Promise);
});

it("creates the destination directory if it doesn't exist", async () => {
	vol.fromJSON(simpleStructure);

	await clone('./templates', './tmp');

	expect(fs.existsSync('./tmp')).toBe(true);
});

it('creates new directories based on the source structure', async () => {
	vol.fromJSON(simpleStructure);

	await clone('./templates', './tmp');

	expect(fs.existsSync('./tmp/bar')).toBe(true);
	expect(fs.existsSync('./tmp/bar/baz')).toBe(true);
});

it('copies files to the new directories', async () => {
	vol.fromJSON(simpleStructure);

	await clone('./templates', './tmp');

	expect(fs.existsSync('./tmp/foo.txt')).toBe(true);
	expect(fs.existsSync('./tmp/bar/foo.txt')).toBe(true);
	expect(fs.existsSync('./tmp/bar/baz/foo.txt')).toBe(true);
});

it('overwrites files if they already exist', async () => {
	vol.fromJSON(existingStructure);

	await clone('./templates', './tmp');

	expect(fs.readFileSync('./tmp/foo.txt', 'utf8')).toBe('bar');
	expect(fs.readFileSync('./tmp/bar/foo.txt', 'utf8')).toBe('boof');
	expect(fs.readFileSync('./tmp/bar/baz/foo.txt', 'utf8')).toBe('boop');
});

it('populates file names with injected data', async () => {
	vol.fromJSON(injectedStructure);

	const inject = { name: 'armadillo' };

	await clone('./templates', './tmp', { inject });

	expect(fs.existsSync('./tmp/armadillo.txt')).toBe(true);
});

it('populates file contents with injected data', async () => {
	vol.fromJSON(injectedStructure);

	const inject = { name: 'armadillo' };

	await clone('./templates', './tmp', { inject });

	expect(fs.readFileSync('./tmp/foo.txt', 'utf8')).toBe('armadillo');
});

it('populates directory names with injected data', async () => {
	vol.fromJSON(injectedStructure);

	const inject = { name: 'armadillo' };

	await clone('./templates', './tmp', { inject });

	expect(fs.existsSync('./tmp/armadillo/foo.txt')).toBe(true);
});

it('mutates the case of file names', async () => {
	vol.fromJSON(caseStructure);

	const inject = { name: 'happy badger' };

	await clone('./templates', './tmp', { inject });

	expect(fs.existsSync('./tmp/HappyBadger.txt')).toBe(true);
});

it('mutates the case of file contents', async () => {
	vol.fromJSON(caseStructure);

	const inject = { name: 'happy badger' };

	await clone('./templates', './tmp', { inject });

	expect(fs.readFileSync('./tmp/foo.txt', 'utf8')).toBe('HappyBadger');
});

it('mutates the case of directory names', async () => {
	vol.fromJSON(caseStructure);

	const inject = { name: 'happy badger' };

	await clone('./templates', './tmp', { inject });

	expect(fs.existsSync('./tmp/HappyBadger/foo.txt')).toBe(true);
});
