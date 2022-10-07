import { fs, vol } from 'memfs';

import { clone } from '../clone';

const simpleStructure = {
	'./templates/foo.txt': 'bar',
	'./templates/bar/foo.txt': 'boof',
	'./templates/bar/baz/foo.txt': 'boop',
};

beforeEach(() => vol.reset());

it("creates the destination directory if it doesn't exist", async () => {
	vol.fromJSON(simpleStructure);

	await clone('./templates', './tmp');

	expect(fs.existsSync('./tmp'));
});

it('creates new directories based on the source structure', async () => {
	vol.fromJSON(simpleStructure);

	await clone('./templates', './tmp');

	expect(fs.existsSync('./tmp/bar'));
	expect(fs.existsSync('./tmp/bar/baz'));
});

it('copies files to the new directories');
it('overwrites files if they already exist');
it('populates file names with injected data');
it('populates file contents with injected data');
it('populates directory names with injected data');
it('mutates the case of file names');
it('mutates the case of file contents');
it('mutates the case of directory names');
